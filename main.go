package main

import (
	"context"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "Pomo",
		Width:     400,
		Height:    400,
		MinWidth:  400,
		MinHeight: 400,
		MaxWidth:  400,
		MaxHeight: 400,
		DisableResize: true,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 20, G: 20, B: 20, A: 1},
		OnStartup:        app.startup,
		OnBeforeClose: func(ctx context.Context) bool {
			if app.forceQuit {
				return false
			}
			runtime.WindowHide(ctx)
			return true
		},
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
