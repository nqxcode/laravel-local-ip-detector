<?php

return [
    'client_ips' => ['127.0.0.1',], // client ips for which local ip will be stored to cookie
    'cookie' => [
        'key' => 'local-ip', // name of cookie with local ip address
        'expires' => 24 * 3600, // expires in seconds, 1 day by default
    ],
];
