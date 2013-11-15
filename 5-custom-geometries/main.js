'use strict'

init();
animate();

function init() {

    initRenderer();
    createGeometries();

}

var sphere, lines = [];

function createGeometries() {

    scene.add( new THREE.Mesh( new THREE.CubeGeometry( 100, 100, 100 ), new THREE.MeshNormalMaterial () ) );

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
        color: 0xffffff, 
        size: 10, 
        sizeAttenuation: true, 
        map: THREE.ImageUtils.loadTexture( 'disc.png' ), 
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending 
    } );

    sphere = new THREE.ParticleSystem( geometry, material );
    sphere.sortParticles = true;
    scene.add( sphere );

    var lines = [];
    var lineMaterial = new THREE.LineBasicMaterial( { 
        color: 0xffffff, 
        linewidth: 2, 
        opacity: .25, 
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

}

function render() {

    updateCamera();
    renderer.render( scene, camera );

}