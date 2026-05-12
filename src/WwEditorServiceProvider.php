<?php

namespace Softbery\WwEditor;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Softbery\WwEditor\Http\Controllers\WwEditorController;
use Softbery\WwEditor\View\Components\WwEditorComponent;

class WwEditorServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/wweditor.php',
            'wweditor'
        );
    }

    public function boot()
    {
        $this->registerRoutes();
        $this->registerResources();
        $this->registerCommands();
        $this->registerPublishing();
        $this->registerComponents();
    }

    protected function registerRoutes()
    {
        Route::group([
            'prefix' => config('wweditor.route_prefix', 'wweditor'),
            'middleware' => config('wweditor.middleware', ['web']),
        ], function () {
            Route::get('/assets', [WwEditorController::class, 'assets'])->name('wweditor.assets');
            Route::post('/save', [WwEditorController::class, 'save'])->name('wweditor.save');
            Route::get('/load/{id}', [WwEditorController::class, 'load'])->name('wweditor.load');
            Route::get('/list', [WwEditorController::class, 'list'])->name('wweditor.list');
            Route::delete('/delete/{id}', [WwEditorController::class, 'delete'])->name('wweditor.delete');
        });
    }

    protected function registerResources()
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'wweditor');
    }

    protected function registerCommands()
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                Commands\InstallWwEditor::class,
                Commands\PublishAssets::class,
            ]);
        }
    }

    protected function registerPublishing()
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/wweditor.php' => config_path('wweditor.php'),
            ], 'wweditor-config');

            $this->publishes([
                __DIR__.'/../resources/assets' => public_path('vendor/wweditor'),
            ], 'wweditor-assets');

            $this->publishes([
                __DIR__.'/../resources/views' => resource_path('views/vendor/wweditor'),
            ], 'wweditor-views');
        }
    }

    protected function registerComponents()
    {
        $this->loadViewComponentsAs('wweditor', [
            'editor' => WwEditorComponent::class,
        ]);
    }
}
