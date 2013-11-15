'use strict'

init();
animate();

function init() {

    initRenderer();
    createGeometry();

}

var sphere;

function createGeometry() {

    var geometry = new THREE.SphereGeometry( 100, 40, 40 );
    var material = new THREE.ParticleBasicMaterial( { color: 0xffffff, size: 10, sizeAttenuation: true, map: THREE.ImageUtils.loadTexture( 'disc.png' ), transparent: true } );
    sphere = new THREE.ParticleSystem( geometry, material );
    // sphere.sortParticles = true;
    scene.add( sphere );

}

function update() {

}

function render() {

    updateCamera();
    renderer.render( scene, camera );

}