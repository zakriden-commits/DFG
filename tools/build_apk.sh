#!/bin/bash
# Полная сборка: игра -> APK (apktool) -> подпись (v1 JAR; v2 по желанию).
#   bash tools/build_apk.sh              # v1+v2 (современные прошивки)
#   V1_ONLY=1 bash tools/build_apk.sh    # только v1 (максимальная совместимость)
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# ---- Java: ищем готовый JDK, иначе ставим jdk4py с PyPI
JDK=""
for c in "$JAVA_HOME" \
         "$ROOT/.venv-tools/lib/python3.11/site-packages/jdk4py/java-runtime" \
         "/tmp/tools/lib/python3.11/site-packages/jdk4py/java-runtime"; do
  if [ -n "$c" ] && [ -x "$c/bin/java" ]; then JDK="$c"; break; fi
done
if [ -z "$JDK" ]; then
  echo "== 0/4 установка JDK (jdk4py)"
  python3 -m venv "$ROOT/.venv-tools" >/dev/null 2>&1 || true
  "$ROOT/.venv-tools/bin/pip" -q install jdk4py cryptography
  JDK="$ROOT/.venv-tools/lib/python3.11/site-packages/jdk4py/java-runtime"
fi
export JAVA_HOME="$JDK"
export PATH="$JAVA_HOME/bin:$PATH"

# ---- apktool: берём jar из npm-пакета, если его нет локально
APKTOOL="${APKTOOL_JAR:-}"
if [ -z "$APKTOOL" ]; then
  for c in "$ROOT/tools/apktool_2.4.1.jar" \
           "/tmp/apk/node_modules/apktool-jar/bin/apktool_2.4.1.jar" \
           "/tmp/apk/node_modules/apktool-jar/bin/apktool.jar"; do
    if [ -f "$c" ]; then APKTOOL="$c"; break; fi
  done
fi
if [ -z "$APKTOOL" ]; then
  echo "== 0/4 установка apktool (npm)"
  mkdir -p /tmp/apk && (cd /tmp/apk && npm i --no-audit --no-fund apktool-jar >/dev/null 2>&1)
  APKTOOL=/tmp/apk/node_modules/apktool-jar/bin/apktool_2.4.1.jar
fi

# ---- python для подписи
PY="${SIGN_PY:-$ROOT/.venv-sign/bin/python}"
if [ ! -x "$PY" ]; then
  echo "== 0/4 установка cryptography"
  python3 -m venv "$ROOT/.venv-sign" >/dev/null 2>&1 || true
  "$ROOT/.venv-sign/bin/pip" -q install cryptography
  PY="$ROOT/.venv-sign/bin/python"
fi

echo "== 1/4 сборка web-бандла"
node game/build.mjs

echo "== 2/4 копирование ассетов"
rm -rf android/assets/*
cp -r game/dist/* android/assets/

echo "== 3/4 apktool build"
mkdir -p build
java -jar "$APKTOOL" b android -o build/deni-islam-unsigned.apk

echo "== 4/4 подпись${V1_ONLY:+ (только v1)}"
"$PY" tools/sign_apk.py build/deni-islam-unsigned.apk build/deni-islam.apk
cp build/deni-islam.apk DENI_ISLAM.apk
ls -la DENI_ISLAM.apk
