'use strict'

var sphere, lines = [], noise;

init();

function init() {

    noise = new ImprovedNoise();

    initRenderer();
    createGeometries();
 
    addSpectrumVisualiser();

    AudioManager.start( { microphone: true, track: '../04-R_outsider' });

    animate();

}

function createGeometries() {

    var geometry = new THREE.Geometry(),
        scale = 4,
        width = 400, height = 200, size = 2 * scale, aStep = .02 * scale;

    var geometries = [];

    for( var a = - Math.PI / 2; a < Math.PI / 2; a += aStep ){

        var y = .5 * height * Math.sin( a );
        var r = .5 * height * Math.cos( a );
        var l = 2 * Math.PI * r;
        var steps = Math.floor( l / size );
        var offset = ( ( width - ( Math.ceil( steps * size ) ) ) * 2 * Math.PI ) / width;

        var g = new THREE.Geometry();
        g.ptIndex = [];

        for( var x = 0; x < steps; x++ ) {

            var ta = ( x * 2 * Math.PI / steps ) + offset;

            var v = new THREE.Vector3( 
                - r * Math.cos( ta ),
                -y,
                r * Math.sin( ta ) 
            );

            geometry.vertices.push( v );

            var v2 = v.clone();
            v2.multiplyScalar( 1.2 );
            g.vertices.push( v2 );
            g.ptIndex.push( geometry.vertices.length - 1 );

        }

        if( g.vertices.length ) {
            g.vertices.push( g.vertices[ 0 ].clone() );
            g.ptIndex.push( g.ptIndex[ 0 ] );
            geometries.push( g );
        }

    }

    var material = new THREE.ParticleBasicMaterial( { 
        color: 0xffae4e, 
        size: 10, 
        sizeAttenuation: true,
        opacity: .75,
        map: THREE.ImageUtils.loadTexture( 'disc-ring.png' ), 
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending 
    } );

    sphere = new THREE.ParticleSystem( geometry, material );
    sphere.geometry.dynamic = true;
    scene.add( sphere );

    var lineMaterial = new THREE.LineBasicMaterial( { 
        color: 0x7e9cff,
        linewidth: 10,
        opacity: .75,
        transparent: true, 
        depthWrite: false,
        blending: THREE.AdditiveBlending 
    } );

    geometries.forEach( function( g ) {
        var line = new THREE.Line( g, lineMaterial );
        line.geometry.dynamic = true;
        lines.push( line );
        scene.add( line );
    } );

}

function update() {

    updateFrequencyData();

    var rx = .0001 * getFreqRange( 20, 30 ),
        ry = .0001 * getFreqRange( 30, 40 ),
        rz = .0001 * getFreqRange( 40, 50 );

    var t = .001 * ( Date.now() - startTime );

    t += .01 * getFreqRange( 140, 170 );

    var r = 50 * noise.noise( t, 0, 0 ) + 50 * .01 * getFreqRange( 150, 160 );
    var n = new THREE.Vector3( 0, 0, 0 );
    var radius = 50;
    var d = .5 + .05 * getFreqRange( 200, 210 );
    var noiseArray = [];
    for( var j = 0; j < sphere.geometry.vertices.length; j++ ) {
        n.copy( sphere.geometry.vertices[ j ] );
        n.normalize();
        var pn = noise.noise( d * n.x + t, d * n.y + t, d * n.z + t );
        var o = 100 + r + radius * pn;
        sphere.geometry.vertices[ j ].copy( n );
        sphere.geometry.vertices[ j ].multiplyScalar( o );
        noiseArray.push( pn );
    }

    sphere.geometry.verticesNeedUpdate = true;

    sphere.rotation.x += rx;
    sphere.rotation.y += ry;
    sphere.rotation.z += rz;

    sphere.material.opacity = 10 * getFreqRange( 50, 150 );
    if( sphere.material.opacity > 1 ) sphere.material.opacity = 1;

    var lOpacity = .1 * getFreqRange( 175, 200 );
    if( lOpacity > .75 ) lOpacity = .75;

    nfov = 70 + getFreqRange( 200, 250 );
    if( nfov > 120 ) nfov = 120;
    
    for( var i = 0; i < lines.length; i++ ) {
        var l = lines[ i ];
        for( var j = 0; j < l.geometry.vertices.length; j++ ) {
            var pn = noiseArray[ l.geometry.ptIndex[ j ] ];
            var o = 100 + ( r + radius * pn ) + 50 * .01 * getFreqRange( 140, 170 );
            l.geometry.vertices[ j ].normalize();
            l.geometry.vertices[ j ].multiplyScalar( o );
        }
        l.geometry.verticesNeedUpdate = true;
        l.material.opacity = lOpacity;
        l.rotation.x += rx;
        l.rotation.y += ry;
        l.rotation.z += rz;
    }

}

function render() {

    drawSpectrum( 25 );
    updateCamera();
    renderer.render( scene, camera );

}