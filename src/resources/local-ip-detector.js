(function () {
    /**
     * Local ip detector.
     *
     * Provides functional for detecting of local ip via WebRTC and storing this ip to the "cookie".
     *
     * @returns {LocalIpDetector}
     * @constructor
     */
    var LocalIpDetector = (function () {
        var self;

        var LocalIpDetector = function (key, expires) {
            self = this;
            this.key = key;
            this.expires = expires;
            this.ips = [];
        };

        var cookie = {
            set: function (name, value, options) {
                options = options || {};

                var expires = options.expires;

                if (typeof expires == "number" && expires) {
                    var d = new Date();
                    d.setTime(d.getTime() + expires * 1000);
                    expires = options.expires = d;
                }
                if (expires && expires.toUTCString) {
                    options.expires = expires.toUTCString();
                }

                value = encodeURIComponent(value);

                var updatedCookie = name + "=" + value;

                for (var propName in options) {
                    updatedCookie += "; " + propName;
                    var propValue = options[propName];
                    if (propValue !== true) {
                        updatedCookie += "=" + propValue;
                    }
                }

                document.cookie = updatedCookie;
            },
            get: function (name) {
                var matches = document.cookie.match(new RegExp(
                    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
                ));
                return matches ? decodeURIComponent(matches[1]) : undefined;
            }
        };

        function detectIp(callback) {
            var ipList = {};

            // Compatibility for firefox and chrome
            var RTCPeerConnection = window.RTCPeerConnection
                || window.mozRTCPeerConnection
                || window.webkitRTCPeerConnection;

            if (!RTCPeerConnection) {
                throw Error('Unable to create WebRTC peer connection!');
            }

            var servers = {iceServers: []};

            // Minimal requirements for data connection
            var mediaConstraints = {
                optional: [{RtpDataChannels: true}]
            };

            // Construct a new RTCPeerConnection
            var pc = new RTCPeerConnection(servers, mediaConstraints);

            function handleCandidate(candidate) {
                // Match just the IP address
                var ipAddress = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(candidate)[1];

                // Remove duplicates
                if (ipList[ipAddress] === undefined) {
                    callback(ipAddress);
                }
                ipList[ipAddress] = true;
            }

            // Listen for candidate events
            pc.onicecandidate = function (ice) {
                // Skip non-candidate events
                if (ice.candidate) {
                    handleCandidate(ice.candidate.candidate);
                }
            };

            // Create a bogus data channel
            pc.createDataChannel('');

            // Create an offer sdp
            pc.createOffer(
                function (result) {
                    // Trigger the stun server request
                    pc.setLocalDescription(
                        result,
                        function () {
                        },
                        function () {
                        }
                    );

                },
                function () {
                }
            );

            // Wait for a while to let everything done
            setTimeout(
                function () {
                    // Read candidate info from local description
                    var lines = pc.localDescription.sdp.split('\n');

                    lines.forEach(function (line) {
                        if (line.indexOf('a=candidate:') === 0) {
                            handleCandidate(line);
                        }
                    });
                },
                1000
            );
        };

        LocalIpDetector.prototype.run = function () {
            if (!cookie.get(this.key)) {
                detectIp(function (ip) {
                    // Math only local IPs
                    if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)) {
                        self.ips.push(ip);
                        cookie.set(self.key, self.ips.join(','), {expires: self.expires});
                    }
                });
            }
        };

        return LocalIpDetector;
    })();

    window.LocalIpDetector = LocalIpDetector;
})();