Laravel 4.2 Local IP detector
==============

Laravel 4.2 package provides fuctionality for detection of client Local IP (via HTML5 WebRTC) and storing of this address to the *cookie*.

## Installation

Require this package in your composer.json and run composer update:

```json
{
	"require": {
          "nqxcode/laravel-local-ip-detector": "1.*"
	}
}
```

After updating composer, add the ServiceProvider to the providers array in `app/config/app.php`

```php
'providers' => [
	'Nqxcode\LaravelLocalIpDetector\ServiceProvider',
],
```

## Configuration 

Publish the config file into your project by running:

```bash
php artisan config:publish nqxcode/laravel-local-ip-detector
```
