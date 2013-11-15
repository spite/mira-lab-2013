'use strict'

init();
animate();

function init() {

    initRenderer();
    createGeometries();

}

var sphere;

function createGeometries() {

    scene.add( new THREE.Mesh( new THREE.CubeGeometry( 100, 100, 100 ), new THREE.MeshNormalMaterial () ) );

    var geometry = new THREE.Geometry(),
        scale = 4,
        width = 400, height = 200, size = 2 * scale, aStep = .02 * scale;

    for( var a = - Math.PI / 2; a < Math.PI / 2; a += aStep ){

        var y = .5 * height * Math.sin( a );
        var r = .5 * height * Math.cos( a );
        var l = 2 * Math.PI * r;
        var steps = Math.floor( l / size );
        var offset = ( ( width - ( Math.ceil( steps * size ) ) ) * 2 * Math.PI ) / width;

        for( var x = 0; x < steps; x++ ) {

            var ta = ( x * 2 * Math.PI / steps ) + offset;

            var v = new THREE.Vector3( 
                - r * Math.cos( ta ),
                -y,
                r * Math.sin( ta ) 
            );

            geometry.vertices.push( v );

        }

    }

    var material = new THREE.ParticleBasicMaterial( { 
        color: 0xffffff, 
        size: 10, 
        sizeAttenuation: true, 
        map: THREE.ImageUtils.loadTexture( 'disc.png' ), 
        transparent: true,
        blending: THREE.NormalBlending 
    } );

    sphere = new THREE.ParticleSystem( geometry, material );
    sphere.sortParticles = true;
    scene.add( sphere );

}

function update() {

}

function render() {

    updateCamera();
    renderer.render( scene, camera );

}