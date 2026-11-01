import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==========================================
// BARAN GARAGE — YAMAHA R1
// ==========================================

// ===== SCENE =====

const scene = new THREE.Scene();
scene.background = new THREE.Color('#101116');

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(5, 3, 7);

// ===== RENDERER =====

const canvas = document.querySelector('#garage');

if (!canvas) {
  throw new Error('Canvas #garage پیدا نشد. index.html را بررسی کن.');
}

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ===== LIGHTING =====

scene.add(
  new THREE.HemisphereLight(0xffffff, 0x252535, 2)
);

const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(5, 8, 6);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xff243d, 2);
rimLight.position.set(-5, 3, -4);
scene.add(rimLight);

const redLight = new THREE.PointLight(0xff1738, 90, 12);
redLight.position.set(-5, 3, -3);
scene.add(redLight);

// ===== CAMERA CONTROLS =====

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 2;
controls.maxDistance = 15;
controls.target.set(0, 0, 0);

// ===== FLOOR =====

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({
    color: 0x08090d,
    roughness: 0.42,
    metalness: 0.5
  })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
scene.add(floor);

// ===== FLOOR LED LINES =====

const floorLedMaterial = new THREE.MeshBasicMaterial({
  color: 0xff102f,
  toneMapped: false
});

for (let i = -2; i <= 2; i++) {
  const strip = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.025, 12),
    floorLedMaterial
  );

  strip.position.set(i * 2.5, -0.475, -1);
  scene.add(strip);
}

// ===== GARAGE WALLS =====

const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x17191f,
  roughness: 0.82,
  metalness: 0.35
});

// Back wall

const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(18, 8, 0.3),
  wallMaterial
);

backWall.position.set(0, 3.5, -7);
scene.add(backWall);

// Left wall

const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(14, 8, 0.3),
  wallMaterial
);

leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-9, 3.5, 0);
scene.add(leftWall);

// Right wall

const rightWall = new THREE.Mesh(
  new THREE.BoxGeometry(14, 8, 0.3),
  wallMaterial
);

rightWall.rotation.y = Math.PI / 2;
rightWall.position.set(9, 3.5, 0);
scene.add(rightWall);

// ===== WALL LEDS =====

const ledMaterial = new THREE.MeshBasicMaterial({
  color: 0xff1838
});

for (let i = -2; i <= 2; i++) {
  const led = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 5.5, 0.06),
    ledMaterial
  );

  led.position.set(i * 3, 3.5, -6.78);
  scene.add(led);
}

// ===== METALLIC WALL PANELS =====

const panelMaterial = new THREE.MeshStandardMaterial({
  color: 0x292c34,
  metalness: 0.7,
  roughness: 0.4
});

for (let i = -3; i <= 3; i++) {
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 2.5, 0.08),
    panelMaterial
  );

  panel.position.set(i * 2.4, 3.2, -6.78);
  scene.add(panel);
}

// ===== CEILING LIGHTS =====

const ceilingLightPositions = [
  [-4, 7, 0],
  [0, 7, 0],
  [4, 7, 0]
];

ceilingLightPositions.forEach(([x, y, z]) => {
  const light = new THREE.PointLight(0xffffff, 180, 15);
  light.position.set(x, y, z);
  scene.add(light);

  const lamp = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.06, 0.35),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );

  lamp.position.set(x, y, z);
  scene.add(lamp);
});

// ===== DISPLAY PLATFORM =====

const platform = new THREE.Mesh(
  new THREE.CylinderGeometry(1.8, 1.9, 0.1, 64),
  new THREE.MeshStandardMaterial({
    color: 0x111318,
    metalness: 0.8,
    roughness: 0.28
  })
);

platform.position.set(0, -0.55, 0);
scene.add(platform);

const platformTop = new THREE.Mesh(
  new THREE.CylinderGeometry(1.72, 1.72, 0.025, 64),
  new THREE.MeshStandardMaterial({
    color: 0x292b32,
    metalness: 0.65,
    roughness: 0.3
  })
);

platformTop.position.set(0, -0.4875, 0);
scene.add(platformTop);

const ring = new THREE.Mesh(
  new THREE.TorusGeometry(1.76, 0.025, 12, 100),
  new THREE.MeshBasicMaterial({
    color: 0xff1738
  })
);

ring.rotation.x = Math.PI / 2;
ring.position.set(0, -0.4875, 0);
scene.add(ring);

// ==========================================
// MOTORCYCLE MODEL
// ==========================================

const loader = new GLTFLoader();

let bikeModel = null;
let paintableMaterials = [];

loader.load(
  '/models/yamaha-r1.glb',

  (gltf) => {
    const bike = gltf.scene;

    const box = new THREE.Box3().setFromObject(bike);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    bike.position.set(
      -center.x,
      -0.46 - box.min.y,
      -center.z
    );

    scene.add(bike);
    bikeModel = bike;

    // Prepare materials for safe customization
    prepareBikeMaterials(bike);

    // Camera framing
    const maxDimension = Math.max(size.x, size.y, size.z);

    camera.position.set(
      maxDimension * 1.15,
      maxDimension * 0.65,
      maxDimension * 1.25
    );

    controls.target.set(0, 0, 0);
    controls.update();

    console.log('Yamaha R1 loaded!');
    console.log('Model dimensions:', size);
    console.log('Paintable materials:', paintableMaterials.length);

    if (paintableMaterials.length === 0) {
      console.warn(
        'No body materials were identified automatically. ' +
        'The model may use generic mesh/material names.'
      );
    }
  },

  (progress) => {
    if (progress.total > 0) {
      console.log(
        `Loading: ${Math.round(
          (progress.loaded / progress.total) * 100
        )}%`
      );
    }
  },

  (error) => {
    console.error('Could not load Yamaha R1:', error);
  }
);
// ==========================================
// TOM CHARACTER + BARAN RIDING GEAR
// ==========================================

let tomModel = null;
let tomGear = null;

loader.load(
  '/models/tom.glb',

  (gltf) => {
    const tom = gltf.scene;

    // Calculate original model size
    const box = new THREE.Box3().setFromObject(tom);
    const size = box.getSize(new THREE.Vector3());

    // Set Tom's height
    if (size.y > 0) {
      const bikeSize = bikeModel
        ? new THREE.Box3()
            .setFromObject(bikeModel)
            .getSize(new THREE.Vector3())
        : null;

      const targetHeight = bikeSize
        ? bikeSize.y * 1.35
        : 1.7;

      tom.scale.setScalar(targetHeight / size.y);
    }

    // Position Tom beside the motorcycle
    tom.updateMatrixWorld(true);

    const scaledBox = new THREE.Box3().setFromObject(tom);
    const center = scaledBox.getCenter(new THREE.Vector3());

    tom.position.x += -1.8 - center.x;
    tom.position.y += -0.46 - scaledBox.min.y;
    tom.position.z += 0.25 - center.z;

    scene.add(tom);
    tomModel = tom;

    // Get Tom's final world dimensions
    tom.updateMatrixWorld(true);

    const finalBox = new THREE.Box3().setFromObject(tom);
    const dimensions = finalBox.getSize(new THREE.Vector3());
    const finalCenter = finalBox.getCenter(new THREE.Vector3());

    const width = dimensions.x;
    const height = dimensions.y;
    const depth = dimensions.z;

    const ground = finalBox.min.y;

    // Gear group
    tomGear = new THREE.Group();
    scene.add(tomGear);

    // Materials
    const blackMaterial = new THREE.MeshStandardMaterial({
      color: 0x101116,
      roughness: 0.65,
      metalness: 0.25
    });

    const redMaterial = new THREE.MeshStandardMaterial({
      color: 0xd71935,
      roughness: 0.5,
      metalness: 0.2
    });

    const visorMaterial = new THREE.MeshStandardMaterial({
      color: 0x090d18,
      metalness: 0.85,
      roughness: 0.12
    });

    // ==================================
    // HELMET
    // ==================================

    const headY = ground + height * 0.86;
    const headWidth = width * 0.28;

    const helmet = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 24),
      blackMaterial
    );

    helmet.scale.set(
      headWidth * 0.58,
      height * 0.075,
      depth * 0.22
    );

    helmet.position.set(
      finalCenter.x,
      headY,
      finalCenter.z
    );

    tomGear.add(helmet);

    // Red helmet stripe
    const helmetStripe = new THREE.Mesh(
      new THREE.BoxGeometry(
        headWidth * 0.12,
        height * 0.12,
        depth * 0.025
      ),
      redMaterial
    );

    helmetStripe.position.set(
      finalCenter.x,
      headY,
      finalCenter.z + depth * 0.19
    );

    tomGear.add(helmetStripe);

    // Helmet visor
    const visor = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 16),
      visorMaterial
    );

    visor.scale.set(
      headWidth * 0.48,
      height * 0.025,
      depth * 0.045
    );

    visor.position.set(
      finalCenter.x,
      headY - height * 0.025,
      finalCenter.z + depth * 0.2
    );

    tomGear.add(visor);

    // ==================================
    // RIDING JACKET
    // ==================================

    const jacket = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 24),
      blackMaterial
    );

    jacket.scale.set(
      width * 0.14,
      height * 0.17,
      depth * 0.2
    );

    jacket.position.set(
      finalCenter.x,
      ground + height * 0.57,
      finalCenter.z
    );

    tomGear.add(jacket);

    // Red jacket center stripe
    const jacketStripe = new THREE.Mesh(
      new THREE.BoxGeometry(
        width * 0.035,
        height * 0.25,
        depth * 0.025
      ),
      redMaterial
    );

    jacketStripe.position.set(
      finalCenter.x,
      ground + height * 0.57,
      finalCenter.z + depth * 0.19
    );

    tomGear.add(jacketStripe);

    // ==================================
    // SLEEVES
    // ==================================

    function addSleeve(startX, endX) {
      const length = Math.abs(endX - startX);

      const sleeve = new THREE.Mesh(
        new THREE.CylinderGeometry(
          width * 0.055,
          width * 0.065,
          length,
          20
        ),
        blackMaterial
      );

      sleeve.rotation.z = Math.PI / 2;

      sleeve.position.set(
        (startX + endX) / 2,
        ground + height * 0.64,
        finalCenter.z
      );

      tomGear.add(sleeve);

      const cuff = new THREE.Mesh(
        new THREE.CylinderGeometry(
          width * 0.06,
          width * 0.06,
          width * 0.045,
          16
        ),
        redMaterial
      );

      cuff.rotation.z = Math.PI / 2;

      cuff.position.set(
        endX,
        ground + height * 0.64,
        finalCenter.z
      );

      tomGear.add(cuff);
    }

    addSleeve(
      finalCenter.x - width * 0.13,
      finalCenter.x - width * 0.34
    );

    addSleeve(
      finalCenter.x + width * 0.13,
      finalCenter.x + width * 0.34
    );

    console.log('Tom with BARAN riding gear loaded!');
  },

  undefined,

  (error) => {
    console.error('Could not load Tom model:', error);
  }
);
// ==========================================
// BODY COLOR DETECTION
// ==========================================

// These names suggest painted motorcycle body parts.

const bodyKeywords = [
  'fairing',
  'cowl',
  'body',
  'tank',
  'fuel',
  'fender',
  'mudguard',
  'frontcover',
  'sidecover',
  'sidepanel',
  'tail',
  'seatcover',
  'cowling',
  'upper',
  'lower',
  'belly',
  'nose',
  'cover',
  'panel'
];

// These names suggest parts that should not be recolored.

const excludedKeywords = [
  'tire',
  'tyre',
  'wheel',
  'rim',
  'brake',
  'disc',
  'rotor',
  'chain',
  'sprocket',
  'engine',
  'motor',
  'exhaust',
  'muffler',
  'pipe',
  'suspension',
  'fork',
  'handle',
  'grip',
  'mirror',
  'light',
  'lamp',
  'glass',
  'screen',
  'windshield',
  'windscreen',
  'seat',
  'rubber',
  'bolt',
  'screw',
  'metal',
  'frame',
  'caliper',
  'pedal',
  'spring',
  'cable',
  'wire'
];

function matchesKeyword(text, keywords) {
  const value = (text || '').toLowerCase().replace(/[\s_.-]/g, '');

  return keywords.some((keyword) =>
    value.includes(keyword.replace(/[\s_.-]/g, ''))
  );
}

function prepareBikeMaterials(bike) {
  paintableMaterials = [];

  bike.traverse((object) => {
    if (!object.isMesh || !object.material) return;

    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];

    materials.forEach((originalMaterial) => {
      if (!originalMaterial) return;

      const meshName = object.name || '';
      const materialName = originalMaterial.name || '';

      const combinedName = `${meshName} ${materialName}`;

      // Exclude mechanical and non-painted parts.
      if (matchesKeyword(combinedName, excludedKeywords)) {
        return;
      }

      // Only select materials with recognizable body-part names.
      if (!matchesKeyword(combinedName, bodyKeywords)) {
        return;
      }

      // Clone material to prevent changing other shared objects.
      const material = originalMaterial.clone();

      material.userData.originalColor = material.color
        ? material.color.clone()
        : null;

      material.userData.originalMaterial = originalMaterial;

      paintableMaterials.push(material);

      // Replace only the matching material on this mesh.
      const materialIndex = materials.indexOf(originalMaterial);

      if (Array.isArray(object.material)) {
        object.material[materialIndex] = material;
      } else {
        object.material = material;
      }
    });
  });
}

// ==========================================
// POSTER STYLE
// ==========================================

const posterStyle = document.createElement('style');

posterStyle.textContent = `
  .yamaha-poster {
    position: fixed;
    top: 85px;
    left: 28px;
    width: min(250px, 32vw);
    padding: 8px;
    background: #101014;
    border: 1px solid #a51e2d;
    box-shadow: 0 0 25px #d20b2933;
    z-index: 5;
  }

  .yamaha-poster img {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  .poster-caption {
    color: white;
    font: 700 12px Arial, sans-serif;
    letter-spacing: 3px;
    padding: 12px 5px 7px;
    text-align: center;
  }

  @media (max-width: 600px) {
    .yamaha-poster {
      width: 115px;
      top: 100px;
      left: 12px;
    }
  }
`;

document.head.appendChild(posterStyle);

// ==========================================
// GARAGE UI STYLE
// ==========================================

const garageStyle = document.createElement('style');

garageStyle.textContent = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    overflow: hidden;
    background: #08090d;
    font-family: Arial, sans-serif;
  }

  #app {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(
        ellipse at 50% 75%,
        #15151b 0%,
        #0b0c10 48%,
        #07080b 100%
      );
  }

  #garage {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    touch-action: none;
  }

  .garage-title {
    position: fixed;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: clamp(18px, 3vw, 32px);
    font-weight: 900;
    letter-spacing: 7px;
    text-shadow: 0 0 18px #e51b35;
    z-index: 6;
    white-space: nowrap;
    pointer-events: none;
  }

  .garage-title span {
    color: #e51b35;
  }

  .garage-subtitle {
    position: fixed;
    top: 65px;
    left: 50%;
    transform: translateX(-50%);
    color: #92929c;
    font-size: 10px;
    letter-spacing: 5px;
    z-index: 6;
    pointer-events: none;
  }

  @media (max-width: 600px) {
    .garage-title {
      top: 18px;
      letter-spacing: 3px;
    }

    .garage-subtitle {
      top: 48px;
      letter-spacing: 2px;
      font-size: 8px;
    }
  }
`;

document.head.appendChild(garageStyle);

// ==========================================
// TITLE
// ==========================================

const title = document.createElement('div');
title.className = 'garage-title';
title.innerHTML = 'BARAN <span>GARAGE</span>';
document.body.appendChild(title);

const subtitle = document.createElement('div');
subtitle.className = 'garage-subtitle';
subtitle.textContent = 'RACING DIVISION · EST. 2026';
document.body.appendChild(subtitle);

// ==========================================
// CUSTOMIZATION PANEL
// ==========================================

const panelStyle = document.createElement('style');

panelStyle.textContent = `
  .custom-panel {
    position: fixed;
    right: 24px;
    top: 110px;
    width: 228px;
    padding: 18px;
    background: rgba(12, 13, 18, 0.94);
    border: 1px solid #393942;
    border-top: 2px solid #e51b35;
    color: white;
    z-index: 10;
    font-family: Arial, sans-serif;
    backdrop-filter: blur(12px);
  }

  .custom-panel h3 {
    margin: 0 0 8px;
    font-size: 14px;
    letter-spacing: 2px;
  }

  .custom-panel p {
    color: #999;
    font-size: 10px;
    letter-spacing: 2px;
    margin: 0 0 16px;
  }

  .color-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .color-option {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 2px solid #555;
    cursor: pointer;
    outline: none;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .color-option:hover {
    transform: scale(1.1);
  }

  .color-option.active {
    border: 2px solid white;
    box-shadow: 0 0 12px #e51b35;
  }

  .color-status {
    margin-top: 15px;
    color: #999;
    font-size: 10px;
    line-height: 1.5;
  }

  @media (max-width: 600px) {
    .custom-panel {
      right: 10px;
      top: auto;
      bottom: 18px;
      width: 165px;
      padding: 12px;
    }

    .color-option {
      width: 28px;
      height: 28px;
    }

    .color-options {
      gap: 8px;
    }
  }
`;

document.head.appendChild(panelStyle);

const panel = document.createElement('div');
panel.className = 'custom-panel';

panel.innerHTML = `
  <h3>R1 GARAGE</h3>
  <p>BODY COLOR</p>

  <div class="color-options">
    <button class="color-option active"
      data-color="#e50920"
      style="background:#e50920"
      aria-label="Red"
      title="Red"></button>

    <button class="color-option"
      data-color="#f2f2f2"
      style="background:#f2f2f2"
      aria-label="White"
      title="White"></button>

    <button class="color-option"
      data-color="#080808"
      style="background:#080808"
      aria-label="Black"
      title="Black"></button>

    <button class="color-option"
      data-color="#164b9b"
      style="background:#164b9b"
      aria-label="Blue"
      title="Blue"></button>

    <button class="color-option"
      data-color="#d4ad42"
      style="background:#d4ad42"
      aria-label="Gold"
      title="Gold"></button>

    <button class="color-option"
      data-color="#777777"
      style="background:#777777"
      aria-label="Silver"
      title="Silver"></button>

    <button class="color-option"
      data-color="#16865a"
      style="background:#16865a"
      aria-label="Green"
      title="Green"></button>

    <button class="color-option"
      data-color="#8b3ca8"
      style="background:#8b3ca8"
      aria-label="Purple"
      title="Purple"></button>
  </div>

  <div class="color-status">
    Select a body color
  </div>
`;

document.body.appendChild(panel);

// ==========================================
// COLOR CHANGE
// ==========================================

const colorButtons = panel.querySelectorAll('.color-option');
const colorStatus = panel.querySelector('.color-status');

colorButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedColor = new THREE.Color(button.dataset.color);

    if (!bikeModel) {
      colorStatus.textContent = 'Motorcycle is still loading...';
      return;
    }

    if (paintableMaterials.length === 0) {
      colorStatus.textContent =
        'Body parts were not identified. Model names need checking.';
      console.warn(
        'No paintable parts detected. Check mesh and material names.'
      );
      return;
    }

    paintableMaterials.forEach((material) => {
      if (material.color) {
        material.color.copy(selectedColor);
      }
    });

    colorButtons.forEach((item) => {
      item.classList.remove('active');
    });

    button.classList.add('active');

    colorStatus.textContent =
      `${button.getAttribute('aria-label')} selected`;
  });
});

// ==========================================
// RESIZE
// ==========================================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ==========================================
// ANIMATION
// ==========================================

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

animate();