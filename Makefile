dev:
	wails dev -browser -tags webkit2_41

build-windows:
	wails build -platform windows/amd64

build-linux:
	wails build -platform linux/amd64

.PHONY: dev build-windows build-linux
