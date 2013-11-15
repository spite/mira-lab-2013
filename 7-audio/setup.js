'use strict'

var renderer, scene, camera, fov = 70, nfov = fov, distance = 300, ndistance = distance;

var lon = 0, nlon = 0, onPointerDownPointerX = 0, onPointerDownLon = 0,
    lat = 0, nlat = 0, onPointerDownPointerY = 0, onPointerDownLat = 0,
    phi = 0, theta = 0,
    isUserInteracting = false;

var startTime = Date.now();

function initRenderer() {

    camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 10000 );

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    onWindowResize();

    var container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    
    container.addEventListener( 'mousedown', onMouseDown, false );
    container.addEventListener( 'mousemove', onMouseMove, false );
    container.addEventListener( 'mouseup', onMouseUp, false );

    container.addEventListener( 'touchstart', onTouchStart, false );
    container.addEventListener( 'touchmove', onTouchMove, false );
    container.addEventListener( 'touchend', onTouchEnd, false );
    container.addEventListener( 'touchcancel', onTouchEnd, false );

    container.addEventListener( 'mousewheel', onMouseWheel, false );
    container.addEventListener( 'DOMMouseScroll', onMouseWheel, false);

}

function onMouseWheel( event ) {

    if ( event.wheelDeltaY ) {
        ndistance -= event.wheelDeltaY * 0.1;
    } else if ( event.wheelDelta ) {
        ndistance -= event.wheelDelta * 0.1;
    } else if ( event.detail ) {
        ndistance += event.detail * 1.0;
    }
    
}


function onMouseDown( event ) {

    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

    event.preventDefault();
    
}

function onMouseMove( event ) {

    if ( isUserInteracting ) {
    
        nlon = ( event.clientX - onPointerDownPointerX ) * 0.1 + onPointerDownLon;
        nlat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
        
    }

}

function onMouseUp( event ) {
    
    isUserInteracting = false;
    event.preventDefault();
   
}

function onTouchStart( event ) {

    var t = event.touches[ 0 ];
    isUserInteracting = true;

    onPointerDownPointerX = t.clientX;
    onPointerDownPointerY = t.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

    event.preventDefault();
    
}

function onTouchMove( event ) {

    var t = event.touches[ 0 ];
    nlon = ( t.clientX - onPointerDownPointerX ) * 0.1 + onPointerDownLon;
    nlat = ( t.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

    event.preventDefault();

}

function onTouchEnd( event ) {

    isUserInteracting = false;
    event.preventDefault();
   
}

function onWindowResize() {

    var s = 1;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( s * window.innerWidth, s * window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );
    update();
    render();

}

function updateCamera() {

    fov += ( nfov - fov ) * .1;
    camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, camera.near, camera.far );

    lon += ( nlon - lon ) * .1;
    lat += ( nlat - lat ) * .1;

    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = ( 90 - lat ) * Math.PI / 180;
    theta = lon * Math.PI / 180;

    distance += ( ndistance - distance ) * .1;
    camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
    camera.position.y = distance * Math.cos( phi );
    camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt( scene.position );

}