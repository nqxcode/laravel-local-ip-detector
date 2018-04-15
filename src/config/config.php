<?php

return [
    'inject' => [
        'resolver' => function () {
            return true; // inject if true
        }
    ],
    'cookie' => [
        'key' => 'local-ip', // name of cookie with local ip address
        'expires' => 24 * 3600, // expires in seconds, 1 day by default
    ],
];
