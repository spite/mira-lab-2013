# MIRA Lab 2013 Workshop

Material for the workshop.

1. Base

   This is the base with the HTML markup, and JavaScript code to set up a Three.js scene, with event handlers.

2. Easing

   The same as base, but introduces the concept of easing function for values such as fov or lat, lon for camera control.

3. Geometry

   Adds a cube and a particle system distributed in a spherical shape.  
   Introduces some of the problems with object sorting.

4. Custom Geometry

   Substitutes the default SphereGeometry with a more pleasing, better distributed one, introducing the method to create custom geometries.

5. Custom Geometries

   Next step when adding geometries: reusing part of a calculated geometry to create a new, different object.

6. Noise

   First step into animation.  
   Introduction to requestAnimationFrame and the render loop.  
   Modifying a mesh in CPU and updating buffers.  
   Introduction to perlin noise.

7. Audio

   How to load a music track or to a microphone.  
   Introduction to Web Audio API and WebRTC getUserMedia.  
   Introduction to Fourier Analysis.  
   How to use frequency domain to synchronise geometry distortions.

8. Basic Shader

   Replacing the standard material for an elemental shader.  
   Introduction to GLSL and the Shader Model.  

9. Advanced Shader

   Using attributes and uniforms.  
   Going crazy with fragment shaders.

10. Further improvements (*not available yet*)

   *Adding video using WebRTC getUserMedia.*  
   *Porting the distortion code to a vertex shader.*

# Requirements

* Chrome or Firefox

   To prevent CORS issues when loading textures and sound files, use a local web development environment, like the integrated web server in OSX, or download XAMPP or a similar package.

   You can also run a standalone Chrome instance with --disable-web-security when loading from file://

* WebGL support

   Make sure your system supports WebGL and your card is not blacklisted: [get.weblg.org](http://get.webgl.org/)

* Patience, curiosity to tinker with "magic" values, and capacity to endure playing the same song over and over and over.

# Credits

Jaume Sanchez Elias [@thespite](http://www.twitter.com/thespite)  
[www.clicktorelease.com](http://www.clicktorelease.com)