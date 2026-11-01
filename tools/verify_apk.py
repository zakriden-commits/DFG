#!/usr/bin/env python3
"""Независимая проверка подписи APK (v1 JAR) — без Android SDK.

Проверяет: digests файлов в MANIFEST.MF, сами секции через CERT.SF,
и RSA-подпись CERT.SF из PKCS#7 (CERT.RSA).
  python tools/verify_apk.py DENI_ISLAM.apk
"""
import sys, zipfile, hashlib, base64
from asn1crypto import cms
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.x509 import load_der_x509_certificate


def parse_manifest(text):
    out, cur = {}, {}
    for raw in text.split('\r\n\r\n'):
        if not raw.strip():
            continue
        for line in raw.split('\r\n'):
            if ': ' in line:
                k, v = line.split(': ', 1)
                cur[k] = v.strip()
        if cur:
            out[cur.get('Name')] = cur
            cur = {}
    return out


def main(path):
    z = zipfile.ZipFile(path)
    names = set(z.namelist())
    for req in ('META-INF/MANIFEST.MF', 'META-INF/CERT.SF', 'META-INF/CERT.RSA'):
        if req not in names:
            print('FAIL: нет', req); return 1

    man_bytes = z.read('META-INF/MANIFEST.MF')
    sf_bytes = z.read('META-INF/CERT.SF')
    man = parse_manifest(man_bytes.decode('utf-8'))
    sf = parse_manifest(sf_bytes.decode('utf-8'))

    problems = []
    main_sf = sf.get(None) or {}
    want = main_sf.get('SHA-256-Digest-Manifest')
    if want:
        got = base64.b64encode(hashlib.sha256(man_bytes).digest()).decode()
        if got != want:
            problems.append('SHA-256-Digest-Manifest не совпадает')
    else:
        problems.append('в CERT.SF нет SHA-256-Digest-Manifest')

    for name, info in man.items():
        if not name or name not in names:
            continue
        d = info.get('SHA-256-Digest')
        if not d:
            continue
        real = base64.b64encode(hashlib.sha256(z.read(name)).digest()).decode()
        if real != d:
            problems.append('плохой digest файла ' + name)
        section = man[name]
        # секция в CERT.SF
        sec = sf.get(name)
        if not sec:
            problems.append('нет секции в CERT.SF: ' + name)
        else:
            # точный текст секции манифеста
            raw = z.read('META-INF/MANIFEST.MF').decode('utf-8')
            idx = raw.find('Name: ' + name)
            end = raw.find('\r\n\r\n', idx)
            section_bytes = raw[idx:end + 4].encode('utf-8')
            got2 = base64.b64encode(hashlib.sha256(section_bytes).digest()).decode()
            if sec.get('SHA-256-Digest') and sec['SHA-256-Digest'] != got2:
                problems.append('плохой digest секции ' + name)

    # криптография PKCS#7
    p7 = cms.ContentInfo.load(z.read('META-INF/CERT.RSA'))
    sd = p7['content']
    si = sd['signer_infos'][0]
    cert = load_der_x509_certificate(sd['certificates'][0].chosen.dump())
    sig = si['signature'].native
    attrs = si['signed_attrs']
    crypto_ok = False
    try:
        if attrs.native:  # jarsigner-стиль: подпись над атрибутами, digest файла в messageDigest
            md = None
            for a in attrs:
                if a['type'].native == 'message_digest':
                    md = a['values'][0].native
            if md != hashlib.sha256(sf_bytes).digest():
                problems.append('messageDigest в подписи не совпадает с CERT.SF')
            else:
                cert.public_key().verify(sig, attrs.untag().dump(), padding.PKCS1v15(), hashes.SHA256())
                crypto_ok = True
        else:
            cert.public_key().verify(sig, sf_bytes, padding.PKCS1v15(), hashes.SHA256())
            crypto_ok = True
    except Exception as e:
        problems.append('RSA-подпись CERT.SF не сходится: %s' % e)

    print('файлов в манифесте: %d' % len([n for n in man if n]))
    print('подпись CERT.SF: %s' % ('OK' if crypto_ok else 'FAILED'))
    print('ошибок: %d' % len(problems))
    for p in problems[:10]:
        print('  -', p)
    return 0 if not problems else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else 'DENI_ISLAM.apk'))
