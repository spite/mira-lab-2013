var fData = null;
var spectrumCanvas, spectrumCtx;

var AudioManager = function() {

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    navigator.getUserMedia = ( navigator.getUserMedia
                           || navigator.webkitGetUserMedia 
                           || navigator.mozGetUserMedia 
                           || navigator.msGetUserMedia );

    var context = new AudioContext(), 
        analyser = context.createAnalyser(), 
        r = false, 
        i = null, 
        s = null, 
        buffer = new Uint8Array( 1024 );

    function onMediaStream( n ) {
        var r = context.createMediaStreamSource( n );
        r.connect( analyser );
    };

    function useMic() {
        navigator.getUserMedia( { audio: true }, onMediaStream, function( e ) { console.log( 'getUserMedia ' + e )} );
    };

    function useArrayBuffer( buffer ) {
        context.decodeAudioData( buffer,
            function( buffer ) {
                
                if( !i ) {
                    i = context.createBufferSource();
                    s = context.createGain();
                    i.connect( analyser );
                    i.loop = true;
                    s.connect( s );
                    analyser.connect( context.destination );
                    s.gain.value = .4;
                }

                i.buffer = buffer;
                i.start( 1 );
                n = false;
                r = true;

            }, function() {
                alert( 'Unable to decode audio data' );
            } );
    };

    function loadTrack( trackName ) {

        var a = new Audio();
        var ext = '';
        if( (a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, '')) ) ext = 'ogg';
        if( (a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')) ) ext = 'mp3';
        
        var oReq = new XMLHttpRequest();
        oReq.open( 'GET', trackName + '.' + ext, true);
        oReq.responseType = 'arraybuffer';
        oReq.onload = function (oEvent) {
            var arrayBuffer = oReq.response; // 
            if (arrayBuffer) {
                useArrayBuffer( arrayBuffer );
            }
        };
        oReq.send(null);

    }

    function init() {

        analyser.smoothingTimeConstant = 0;
        analyser.fftSize = 512;

    }

    function start( settings ) {
        if( settings.microphone ) useMic();
        if( settings.track ) loadTrack( settings.track );
    }

    init();

    return {
        start: start,
        analyser: analyser
    }

}();

function getFreqRange( from, to ) {

    var v = 0;
    for( var j = from; j < to; j++ ) {
        v += fData[ j ];
    }
    return v / ( to - from );

}

function updateFrequencyData() {

    var freqByteData = new Uint8Array( AudioManager.analyser.frequencyBinCount );
    AudioManager.analyser.getByteFrequencyData(freqByteData);
    if( !fData ) {
        fData = new Array();
        for( var j = 0; j < freqByteData.length; j++ ) {
            fData[ j ] = freqByteData[ j ];
        }
    }

    for( var j = 0; j < freqByteData.length; j++ ) {
        fData[ j ] += ( freqByteData[ j ] - fData[ j ] ) * .1;
    }

}

function addSpectrumVisualiser() {

    spectrumCanvas = document.createElement( 'canvas' );
    spectrumCanvas.width = 256;
    spectrumCanvas.height = 64;
    spectrumCanvas.setAttribute( 'id', 'spectrumCanvas' );
    spectrumCtx = spectrumCanvas.getContext( '2d' );

    document.body.appendChild( spectrumCanvas );

}

function drawSpectrum( step ) {

    spectrumCtx.clearRect( 0, 0, spectrumCanvas.width, spectrumCanvas.height );
    for( var j = 0; j < fData.length; j+= step ) {
        var v = getFreqRange( j, j + step );// * Math.exp(.01*j);
        spectrumCtx.fillStyle = 'rgb(255,' + j + ',' + j + ')';
        spectrumCtx.beginPath();
        spectrumCtx.fillRect( j, spectrumCanvas.height, step, - v * spectrumCanvas.height / 256 );
        spectrumCtx.font = "normal 10px Arial";
        spectrumCtx.save();
        spectrumCtx.rotate( Math.PI / 2 );
        spectrumCtx.beginPath();
        spectrumCtx.fillText( j, 10, -j );
        spectrumCtx.restore();
    }

}