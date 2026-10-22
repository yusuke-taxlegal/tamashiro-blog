#!/bin/bash
# 使い方: ./shot.sh <名前（.html抜き）> <幅,高さ>
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT=${FIG_OUT:-/tmp/company-setup-capital-deposit-fig}
mkdir -p "$OUT"
"$CH" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 --window-size=$2 --screenshot="$OUT/$1.png" "file://$PWD/$1.html" >/dev/null 2>&1 && echo "$OUT/$1.png"
