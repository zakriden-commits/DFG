#!/bin/bash
# Полная сборка: игра -> APK (apktool) -> подпись (v1+v2)
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

JDK="${JAVA_HOME:-$ROOT/.venv-tools/lib/python3.11/site-packages/jdk4py/java-runtime}"
export JAVA_HOME="$JDK"
export PATH="$JAVA_HOME/bin:$PATH"
APKTOOL="${APKTOOL_JAR:-/tmp/apk/node_modules/apktool-jar/bin/apktool_2.4.1.jar}"
PY="${SIGN_PY:-$ROOT/.venv-sign/bin/python}"

echo "== 1/4 сборка web-бандла"
node game/build.mjs

echo "== 2/4 копирование ассетов"
rm -rf android/assets/*
cp -r game/dist/* android/assets/

echo "== 3/4 apktool build"
mkdir -p build
java -jar "$APKTOOL" b android -o build/deni-islam-unsigned.apk

echo "== 4/4 подпись"
"$PY" tools/sign_apk.py build/deni-islam-unsigned.apk build/deni-islam.apk
cp build/deni-islam.apk DENI_ISLAM.apk
ls -la DENI_ISLAM.apk
