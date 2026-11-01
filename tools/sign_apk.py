#!/usr/bin/env python3
"""
Pure-python APK signer (v1 JAR signature + v2 APK Signature Scheme block).
Used because no Android SDK / apksigner is available in this environment.

  sign_apk.py <unsigned.apk> <out.apk>
"""
import sys, os, io, struct, zlib, hashlib, base64, datetime, zipfile

from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.serialization import pkcs7

HERE = os.path.dirname(os.path.abspath(__file__))
KEY_PATH = os.path.join(HERE, 'deni-key.pem')
CERT_PATH = os.path.join(HERE, 'deni-cert.pem')

CHUNK = 1024 * 1024
SIG_ALGO = 0x0103          # RSASSA-PKCS1-v1_5 with SHA2-256 (chunked)
V2_BLOCK_ID = 0x7109871A
MAGIC = b'APK Sig Block 42'


# ---------------------------------------------------------------- keys
def load_or_make_key():
    if os.path.exists(KEY_PATH) and os.path.exists(CERT_PATH):
        key = serialization.load_pem_private_key(open(KEY_PATH, 'rb').read(), password=None)
        cert = x509.load_pem_x509_certificate(open(CERT_PATH, 'rb').read())
        return key, cert
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    name = x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, u'Deni Islam'),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, u'Deni Islam Studio'),
        x509.NameAttribute(NameOID.COUNTRY_NAME, u'NL'),
    ])
    now = datetime.datetime.now(datetime.timezone.utc)
    cert = (x509.CertificateBuilder()
            .subject_name(name).issuer_name(name)
            .public_key(key.public_key())
            .serial_number(x509.random_serial_number())
            .not_valid_before(now - datetime.timedelta(days=1))
            .not_valid_after(now + datetime.timedelta(days=365 * 30))
            .add_extension(x509.BasicConstraints(ca=True, path_length=None), critical=True)
            .sign(key, hashes.SHA256()))
    open(KEY_PATH, 'wb').write(key.private_bytes(
        serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))
    open(CERT_PATH, 'wb').write(cert.public_bytes(serialization.Encoding.PEM))
    return key, cert


# ---------------------------------------------------------------- v1
def b64(d):
    return base64.b64encode(d).decode()


def wrap72(line):
    """JAR manifest line wrapping (72 bytes + continuation)."""
    out = []
    while len(line.encode()) > 72:
        # cut on a byte boundary
        cut = 72
        while len(line[:cut].encode()) > 72:
            cut -= 1
        out.append(line[:cut])
        line = ' ' + line[cut:]
    out.append(line)
    return '\r\n'.join(out)


def build_v1(entries, key, cert):
    man = ['Manifest-Version: 1.0', 'Created-By: Deni Islam Build', '', '']
    sections = {}
    for name, data in entries:
        if name == 'META-INF/MANIFEST.MF':
            continue
        section = 'Name: %s\r\nSHA-256-Digest: %s\r\n\r\n' % (name, b64(hashlib.sha256(data).digest()))
        sections[name] = section
        man.append(wrap72(section).replace('\r\n\r\n', '\r\n') + '\r\n')
    manifest = ''.join(man).encode()
    # normalise: rebuild properly
    body = 'Manifest-Version: 1.0\r\nCreated-By: Deni Islam Build\r\n\r\n'
    for name, section in sections.items():
        body += wrap72('Name: %s' % name) + '\r\n'
        body += wrap72('SHA-256-Digest: %s' % b64(hashlib.sha256(dict(entries)[name]).digest())) + '\r\n\r\n'
    manifest = body.encode()

    sf = 'Signature-Version: 1.0\r\nCreated-By: Deni Islam Build\r\n'
    sf += 'SHA-256-Digest-Manifest: %s\r\n\r\n' % b64(hashlib.sha256(manifest).digest())
    for name, section in sections.items():
        sf += wrap72('Name: %s' % name) + '\r\n'
        sf += wrap72('SHA-256-Digest: %s' % b64(hashlib.sha256(section.encode()).digest())) + '\r\n\r\n'
    sf_bytes = sf.encode()

    builder = pkcs7.PKCS7SignatureBuilder().set_data(sf_bytes).add_signer(cert, key, hashes.SHA256())
    options = [pkcs7.PKCS7Options.DetachedSignature, pkcs7.PKCS7Options.Binary]
    rsa_sig = builder.sign(serialization.Encoding.DER, options)

    return [
        ('META-INF/MANIFEST.MF', manifest),
        ('META-INF/CERT.SF', sf_bytes),
        ('META-INF/CERT.RSA', rsa_sig),
    ]


# ---------------------------------------------------------------- zip writer
ALIGN_ID = 0xD935          # extra-field id used by Android zipalign


def align_extra(offset, name_len, align=4):
    """Bytes of extra field needed so the entry DATA starts on an `align` boundary.

    Android 11+ refuses APKs whose uncompressed resources.arsc is not 4-byte
    aligned ("the file is corrupt" for the user), so this is mandatory.
    """
    base = offset + 30 + name_len + 0  # local header + file name
    pad = (-base) % align
    if pad == 0:
        return b''
    if pad < 4:                     # an extra-field record needs 4 bytes of header
        pad += align
    payload = b'\x00' * (pad - 4)
    return struct.pack('<HH', ALIGN_ID, len(payload)) + payload


def zip_build(items, align=4):
    """items: list of (name, data, stored_bool). Returns full zip bytes."""
    out = io.BytesIO()
    central = []
    for name, data, stored in items:
        nb = name.encode()
        crc = zlib.crc32(data) & 0xffffffff
        if stored:
            method, payload, csize = 0, data, len(data)
        else:
            co = zlib.compressobj(9, zlib.DEFLATED, -15)
            payload = co.compress(data) + co.flush()
            method, csize = 8, len(payload)
        offset = out.tell()
        extra = align_extra(offset, len(nb), align) if stored else b''
        out.write(struct.pack('<IHHHHHIIIHH', 0x04034b50, 20, 0, method, 0, 0x21,
                              crc, csize, len(data), len(nb), len(extra)))
        out.write(nb)
        out.write(extra)
        out.write(payload)
        central.append(struct.pack('<IHHHHHHIIIHHHHHII', 0x02014b50, 20, 20, 0, method, 0, 0x21,
                                   crc, csize, len(data), len(nb), 0, 0, 0, 0, 0, offset) + nb)
    cd_offset = out.tell()
    cd = b''.join(central)
    out.write(cd)
    out.write(struct.pack('<IHHHHIIH', 0x06054b50, 0, 0, len(items), len(items), len(cd), cd_offset, 0))
    return out.getvalue()


def lp(b):
    return struct.pack('<I', len(b)) + b


def chunked_digest(data):
    chunks = [data[i:i + CHUNK] for i in range(0, len(data), CHUNK)] or [b'']
    inner = b''.join(hashlib.sha256(b'\xa5' + struct.pack('<I', len(c)) + c).digest() for c in chunks)
    return hashlib.sha256(b'\x5a' + struct.pack('<I', len(chunks)) + inner).digest()


def v2_sign(zip_bytes, key, cert):
    eocd_pos = zip_bytes.rfind(b'PK\x05\x06')
    cd_offset = struct.unpack('<I', zip_bytes[eocd_pos + 16:eocd_pos + 20])[0]
    content = zip_bytes  # EOCD already carries the correct CD offset for the signed file
    content_digest = chunked_digest(content)

    cert_der = cert.public_bytes(serialization.Encoding.DER)
    pub = key.public_key().public_bytes(serialization.Encoding.DER,
                                        serialization.PublicFormat.SubjectPublicKeyInfo)

    digests = lp(struct.pack('<I', SIG_ALGO)) + lp(content_digest)
    certs = lp(cert_der)
    attrs = b''
    signed_data = lp(digests) + lp(certs) + lp(attrs)

    signature = key.sign(signed_data, padding.PKCS1v15(), hashes.SHA256())
    signatures = lp(struct.pack('<I', SIG_ALGO)) + lp(signature)
    signer = lp(signed_data) + lp(signatures) + lp(pub)
    value = lp(signer)

    pair = struct.pack('<Q', len(value) + 4) + struct.pack('<I', V2_BLOCK_ID) + value
    size = len(pair) + 8 + 16
    block = struct.pack('<Q', size) + pair + struct.pack('<Q', size) + MAGIC

    cd = zip_bytes[cd_offset:eocd_pos]
    eocd = bytearray(zip_bytes[eocd_pos:])
    new_cd_offset = cd_offset + len(block)
    struct.pack_into('<I', eocd, 16, new_cd_offset)
    out = zip_bytes[:cd_offset] + block + cd + bytes(eocd)
    return out


def verify(out_bytes, cert):
    """Minimal self-check: locate block, verify the RSA signature + digest."""
    eocd_pos = out_bytes.rfind(b'PK\x05\x06')
    cd_offset = struct.unpack('<I', out_bytes[eocd_pos + 16:eocd_pos + 20])[0]
    magic_pos = out_bytes.rfind(MAGIC)
    size2 = struct.unpack('<Q', out_bytes[magic_pos - 8:magic_pos])[0]
    block_start = magic_pos + 8 - size2
    size1 = struct.unpack('<Q', out_bytes[block_start:block_start + 8])[0]
    assert size1 == size2, 'signing block sizes mismatch'
    assert block_start + 8 + size1 == cd_offset, 'block does not end at central directory'
    pairs = out_bytes[block_start + 8:magic_pos - 8]
    plen = struct.unpack('<Q', pairs[:8])[0]
    block_id = struct.unpack('<I', pairs[8:12])[0]
    assert block_id == V2_BLOCK_ID, 'bad block id'
    value = pairs[12:8 + plen]

    def rd(buf, off):
        n = struct.unpack('<I', buf[off:off + 4])[0]
        return buf[off + 4:off + 4 + n], off + 4 + n

    signer, _ = rd(value, 0)
    signed_data, off = rd(signer, 0)
    signatures, off = rd(signer, off)
    pub, off = rd(signer, off)
    algo_bytes, soff = rd(signatures, 0)
    sig_alg = struct.unpack('<I', algo_bytes[:4])[0]
    sig, soff = rd(signatures, soff)
    pubkey = serialization.load_der_public_key(pub)
    pubkey.verify(sig, signed_data, padding.PKCS1v15(), hashes.SHA256())
    assert sig_alg == SIG_ALGO

    digests, _ = rd(signed_data, 0)
    d_algo_bytes, doff = rd(digests, 0)
    d_alg = struct.unpack('<I', d_algo_bytes[:4])[0]
    digest, doff = rd(digests, doff)
    assert d_alg == SIG_ALGO

    # recompute content digest over file with CD offset replaced by block start
    eocd = bytearray(out_bytes[eocd_pos:])
    struct.pack_into('<I', eocd, 16, block_start)
    content = out_bytes[:block_start] + out_bytes[cd_offset:eocd_pos] + bytes(eocd)
    return chunked_digest(content) == digest


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 1
    src, dst = sys.argv[1], sys.argv[2]
    key, cert = load_or_make_key()

    zin = zipfile.ZipFile(src)
    items = []
    for info in zin.infolist():
        if info.filename.startswith('META-INF/'):
            continue
        if info.filename.endswith('/'):
            continue
        data = zin.read(info.filename)
        stored = info.filename == 'resources.arsc' or info.filename.endswith('.png') and False
        items.append((info.filename, data, stored))
    zin.close()

    v1 = build_v1([(n, d) for n, d, _ in items], key, cert)
    for name, data in v1:
        items.append((name, data, False))

    v1_only = os.environ.get('V1_ONLY') == '1'
    raw = zip_build(items)
    # v2-блок иногда принимается не всеми прошивками — умеем собирать чистый v1
    signed = raw if v1_only else v2_sign(raw, key, cert)
    open(dst, 'wb').write(signed)

    ok = True if v1_only else verify(signed, cert)
    z = zipfile.ZipFile(dst)
    bad = z.testzip()

    # ---- Android package-parser style checks (the reason installs fail with "corrupt file")
    blob = open(dst, 'rb').read()
    problems = []
    for info in z.infolist():
        off = info.header_offset
        if blob[off:off + 4] != b'PK\x03\x04':
            problems.append('bad local header ' + info.filename)
            continue
        nlen, elen = struct.unpack('<HH', blob[off + 26:off + 30])
        dstart = off + 30 + nlen + elen
        align = 4 if info.filename in ('resources.arsc',) or info.filename.endswith('.so') else 0
        if align and dstart % align:
            problems.append('%s not %d-byte aligned (%d)' % (info.filename, align, dstart))
        if info.filename == 'resources.arsc' and info.compress_type != 0:
            problems.append('resources.arsc is compressed')
    arsc = z.getinfo('resources.arsc') if 'resources.arsc' in z.namelist() else None
    print('signed apk: %s (%.1f KB) · entries: %d · %s: %s · zip: %s · arsc: %s · checks: %s' % (
        dst, len(signed) / 1024, len(z.namelist()),
        'v1 only' if v1_only else 'v2', 'OK' if ok else 'FAILED', 'OK' if bad is None else bad,
        'stored+aligned' if (arsc and arsc.compress_type == 0) else 'BAD',
        'OK' if not problems else '; '.join(problems)))
    assert ok, 'v2 signature verification failed'
    assert not problems, problems
    return 0


if __name__ == '__main__':
    sys.exit(main())
