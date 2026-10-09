#!/bin/bash
cd "$(dirname "$0")"
echo "경성야록을 여는 중입니다... (이 창은 켜 둔 채로 두세요)"
(sleep 2; open "http://localhost:8765/") &
python3 -m http.server 8765
