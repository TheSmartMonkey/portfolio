import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { animate } from './animate';

class CameraControl {
  zoomMode = false;
  press = false;
  sensitivity = 0.02;

  constructor(renderer, camera, updateCallback) {
    renderer.domElement.addEventListener('mousemove', (event) => {
      if (!this.press) {
        return;
      }

      if (event.button == 0) {
        camera.position.y -= event.movementY * this.sensitivity;
        camera.position.x -= event.movementX * this.sensitivity;
      } else if (event.button == 2) {
        camera.quaternion.y -= (event.movementX * this.sensitivity) / 10;
        camera.quaternion.x -= (event.movementY * this.sensitivity) / 10;
      }

      updateCallback();
    });

    renderer.domElement.addEventListener('mousedown', () => {
      this.press = true;
    });
    renderer.domElement.addEventListener('mouseup', () => {
      this.press = false;
    });
    renderer.domElement.addEventListener('mouseleave', () => {
      this.press = false;
    });

    document.addEventListener('keydown', (event) => {
      if (event.key == 'Shift') {
        this.zoomMode = true;
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key == 'Shift') {
        this.zoomMode = false;
      }
    });

    renderer.domElement.addEventListener('mousewheel', (event) => {
      if (this.zoomMode) {
        camera.fov += event.wheelDelta * this.sensitivity;
        camera.updateProjectionMatrix();
      } else {
        camera.position.z += event.wheelDelta * this.sensitivity;
      }

      updateCallback();
    });
  }
}

// Scene
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Render
export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new CameraControl(renderer, camera, () => {
  // you might want to rerender on camera update if you are not rerendering all the time
  window.requestAnimationFrame(() => renderer.render(scene, camera));
});

// Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
export const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 10;

if (WebGL.isWebGLAvailable()) {
  animate();
} else {
  document.getElementById('error-message').innerText = 'Your browser is to old try to update it or use Chrome instead'
}
