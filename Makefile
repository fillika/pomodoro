WAILS := $(HOME)/go/bin/wails

dev:
	$(WAILS) dev -browser -tags webkit2_41

build-windows:
	$(WAILS) build -platform windows/amd64

build-linux:
	$(WAILS) build -platform linux/amd64

format:
	cd frontend && npm run format

.PHONY: dev build-windows build-linux format
