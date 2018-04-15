<?php namespace Nqxcode\LaravelLocalIpDetector\Controllers;

use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\Response;

class AssetsController extends Controller
{
    public function js()
    {
        $response = new Response;

        $response->headers->set('Content-Type', 'text/javascript');
        $response->setExpires(new \DateTime('now +1 year'));
        $response->setMaxAge(31536000);
        $response->setSharedMaxAge(31536000);

        $response->setContent(file_get_contents(__DIR__ . '/../resources/local-ip-detector.js'));

        return $response;
    }
}
