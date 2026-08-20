cd audio
./sointu-compile -arch wasm song.yml
wat2wasm song.wat

cd ..
base64 -i audio/song.wasm -o audio/songbase64.txt
