define(function (require) {

    var fs = require('intern/dojo/node!fs');
    var streams = JSON.parse(fs.readFileSync('./test/functional/config/streams.json', 'utf8'));

    var streamsArray = [];
    for (var key in streams) {
        streamsArray.push(streams[key]);
    }

    var _createInstance = function () {
        return {
            asyncTimeout: 10,

            tests: {
                default: {
                    streams: streamsArray
                },

                seek: {
                    seekCount: 2
                },

                seekDVR: {
                    seekCount: 2
                },

                pause: {
                    pauseCount: 2
                },

                trickMode: {
                    streams: [
                        streams.MSS_VOD_1
                    ]
                }
            }
        };
    };

    var _getInstance = function () {
        if (!this._instance) {
            this._instance = _createInstance();
        }
        return this._instance;
    };

    return _getInstance();
});
