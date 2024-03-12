firefox_path= "C:\Program Files\Firefox Developer Edition\firefox.exe"

build:
	web-ext build --no-config-discovery --overwrite-dest --source-dir=./firefox

run:
	web-ext run --source-dir=./firefox --firefox=$(firefox_path)