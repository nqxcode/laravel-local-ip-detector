<script src="{{{ route('laravel-local-ip-detector.assets.js') }}}"></script>

<script>
    $(function () {
        var localIpDetector = new LocalIpDetector(
            {{ json_encode(Config::get('laravel-local-ip-detector::cookie.key')) }},
            {{ json_encode(Config::get('laravel-local-ip-detector::cookie.expires')) }}
        );
        localIpDetector.run();
    });
</script>