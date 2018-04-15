<?php namespace Nqxcode\LaravelLocalIpDetector;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ServiceProvider extends \Illuminate\Support\ServiceProvider
{
    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = false;

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->package('nqxcode/laravel-local-ip-detector', null, __DIR__);

        $this->app['router']->get(
            '/laravel-local-ip-detector/assets/js',
            [
                'uses' => 'Nqxcode\LaravelLocalIpDetector\Controllers\AssetsController@js',
                'as' => 'laravel-local-ip-detector.assets.js'
            ]
        );

        if (call_user_func($this->app['config']->get('laravel-local-ip-detector::inject.resolver'))) {
            $this->app['router']->after(
                function (Request $request, Response $response) {
                    $content = $response->getContent();
                    $pos = strripos($content, '</body>');
                    if (false !== $pos) {
                        $injectContent = $this->app['view']->make('laravel-local-ip-detector::injection')->render();
                        $content = substr($content, 0, $pos) . $injectContent . substr($content, $pos);
                        $response->setContent($content);
                    }
                }
            );
        }
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return [];
    }
}