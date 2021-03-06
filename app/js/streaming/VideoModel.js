/*
 * The copyright in this software is being made available under the BSD License, included below. This software may be subject to other third party and contributor rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Digital Primates
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * •  Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * •  Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * •  Neither the name of the Digital Primates nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
MediaPlayer.models.VideoModel = function () {
    "use strict";

    var element,
        stalledStreams = [],
        TTMLRenderingDiv = null,

        addStalledStream = function (type) {    
            if (type === null || stalledStreams.indexOf(type) !== -1) {
                return;
            }
    
            this.debug.info("<video> # stall stream " + type);
            stalledStreams.push(type);
            // If at least one stream is stalled, then halt playback until nothing is stalled
            if (stalledStreams.length === 1) {
                this.setPlaybackRate(0);
            }
        },

        removeStalledStream = function (type) {
            var index = stalledStreams.indexOf(type);
    
            if (type === null) {
                return;
            }
            this.debug.info("<video> # unstall stream " + type);
            if (index !== -1) {
                stalledStreams.splice(index, 1);
            }
            // If no stream is stalled then resume playback.
            if (this.isStalled() === false && element.playbackRate === 0) {
                this.setPlaybackRate(1);
            }
        };

    return {
        system: undefined,
        debug: undefined,

        setup: function () {
            stalledStreams = [];
        },

        reset: function () {
            stalledStreams = [];
        },

        play: function () {
            this.debug.info("<video> # play()");
            element.play();
        },

        pause: function () {
            this.debug.info("<video> # pause()");
            element.pause();
        },

        isPaused: function () {
            return element.paused;
        },

        isSeeking: function () {
            return element.seeking;
        },

        getDuration: function () {
            return element.duration;
        },

        getPlaybackRate: function () {
            return element.playbackRate;
        },

        setPlaybackRate: function (value) {
            this.debug.info("<video> # playbackRate = " + value);
            element.playbackRate = value;
        },

        getMute: function () {
            return element.muted;
        },

        setMute: function (value) {
            element.muted = value;
        },

        getVolume: function () {
            return element.volume;
        },

        setVolume: function (value) {
            element.volume = value;
        },

        getCurrentTime: function () {
            return element.currentTime;
        },

        setCurrentTime: function (currentTime) {
            this.debug.info("<video> # currentTime = " + currentTime);
            element.currentTime = currentTime;
        },

        listen: function (type, callback) {
            element.addEventListener(type, callback, false);
        },

        unlisten: function (type, callback) {
            element.removeEventListener(type, callback, false);
        },

        listenOnParent: function (type, callback) {
            element.parentElement.addEventListener(type, callback, false);
        },

        unlistenOnParent: function (type, callback) {
            element.parentElement.removeEventListener(type, callback, false);
        },

        getElement: function () {
            return element;
        },

        setElement: function (value) {
            element = value;
        },

        setSource: function (source) {
            if (source) {
                this.debug.info("<video> # set source");
                element.src = source;
            } else {
                this.debug.info("<video> # reset source");
                element.removeAttribute('src');
                element.load();
            }
        },

        isStalled: function () {
            return (stalledStreams.length > 0);
        },

        stallStream: function (type, stalled) {
            if (stalled) {
                addStalledStream.call(this, type);
            } else {
                removeStalledStream.call(this, type);
            }
        },
        
        getTTMLRenderingDiv: function() {
            return TTMLRenderingDiv;
        },

        setTTMLRenderingDiv: function(div) {
            TTMLRenderingDiv = div;
            // The styling will allow the captions to match the video window size and position.
            TTMLRenderingDiv.style.position = 'absolute';
            TTMLRenderingDiv.style.display = 'flex';
            TTMLRenderingDiv.style.overflow = 'hidden';
            TTMLRenderingDiv.style.pointerEvents = 'none';
            TTMLRenderingDiv.style.top = 0;
            TTMLRenderingDiv.style.left = 0;
        }
    };
};

MediaPlayer.models.VideoModel.prototype = {
    constructor: MediaPlayer.models.VideoModel
};
