<?php

return [
    'client_ips' => ['127.0.0.1',], // store cookie with local ip for client ips
    'cookie' => [
        'key' => 'local-ip', // name of cookie with local ip address
        'expires' => 24 * 3600, // expires in seconds, 1 day by default
    ],
];
