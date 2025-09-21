"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three-stdlib";
import { PaintingData } from "./paintingData";

interface ThreeGalleryProps {
  paintingData: PaintingData[];
  galleryId: string;
  settings?: {
    backgroundColor?: string;
    lightingIntensity?: number;
    showAudioGuide?: boolean;
    showInfoPanels?: boolean;
  };
}

export default function ThreeGallery({
  paintingData,
  galleryId,
  settings,
}: ThreeGalleryProps) {
  // For now, we'll use the existing paintingData structure
  // In the future, we can enhance this to fetch images from subcollections
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<PointerLockControls | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    console.log("Initializing 3D Gallery with painting data:", paintingData);
    console.log("Number of paintings to load:", paintingData.length);
    paintingData.forEach((painting, index) => {
      console.log(
        `Painting ${index + 1}: ${painting.imgSrc} at position (${
          painting.position.x
        }, ${painting.position.y}, ${painting.position.z})`
      );
    });

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 15);
    cameraRef.current = camera;
    scene.add(camera);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xffffff, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new PointerLockControls(camera, renderer.domElement);
    controlsRef.current = controls;
    scene.add(controls.getObject());

    // Movement variables
    const movementState = {
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      velocity: new THREE.Vector3(),
      direction: new THREE.Vector3(),
    };

    // Add event listener for pointer lock change
    controls.addEventListener("lock", () => {
      console.log("Pointer locked");
    });

    controls.addEventListener("unlock", () => {
      console.log("Pointer unlocked");
    });

    // Create paintings
    const paintings = createPaintings(scene, paintingData);

    // Create walls
    const walls = createWalls(scene);

    // Setup lighting
    setupLighting(scene, paintings);

    // Setup floor
    setupFloor(scene);

    // Setup ceiling
    createCeiling(scene);

    // Add ceiling lights
    createCeilingLights(scene);

    // Add decorative plants
    createPlants(scene);

    // Event listeners
    const cleanupEventListeners = setupEventListeners(
      controls,
      renderer,
      camera,
      paintings,
      movementState
    );

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Handle movement
      const delta = 0.016; // 60fps
      movementState.velocity.x -= movementState.velocity.x * 10.0 * delta;
      movementState.velocity.z -= movementState.velocity.z * 10.0 * delta;

      movementState.direction.z =
        Number(movementState.moveForward) - Number(movementState.moveBackward);
      movementState.direction.x =
        Number(movementState.moveRight) - Number(movementState.moveLeft);
      movementState.direction.normalize();

      if (movementState.moveForward || movementState.moveBackward)
        movementState.velocity.z -= movementState.direction.z * 400.0 * delta;
      if (movementState.moveLeft || movementState.moveRight)
        movementState.velocity.x -= movementState.direction.x * 400.0 * delta;

      controls.moveRight(-movementState.velocity.x * delta);
      controls.moveForward(-movementState.velocity.z * delta);

      // Check proximity to paintings for story display
      const now = Date.now();
      if (now - lastProximityCheck > 500) { // Check every 500ms
        lastProximityCheck = now;
        
        const cameraPosition = camera.position;
        let closestPainting = null;
        let closestDistance = Infinity;

        // Check distance to each painting
        paintings.forEach((painting: any) => {
          if (painting.userData && painting.userData.info) {
            const distance = cameraPosition.distanceTo(painting.position);
            if (distance < closestDistance && distance < 5) { // 5 units proximity threshold
              closestDistance = distance;
              closestPainting = painting;
            }
          }
        });

        // Show info for closest painting if we're close enough
        if (closestPainting && closestPainting.userData.info !== currentPaintingInfo) {
          currentPaintingInfo = closestPainting.userData.info;
          showPaintingInfo(currentPaintingInfo);
        } else if (!closestPainting && currentPaintingInfo) {
          // Hide info if we moved away from all paintings
          currentPaintingInfo = null;
          hidePaintingInfo();
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Hide loading indicator after a short delay
    setTimeout(() => {
      const loadingIndicator = document.getElementById("loading-indicator");
      if (loadingIndicator) {
        loadingIndicator.style.display = "none";
      }
    }, 2000);

    // Window resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (cleanupEventListeners) {
        cleanupEventListeners();
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [paintingData, galleryId]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="w-full h-full" />

      {/* Loading Indicator */}
      <div
        id="loading-indicator"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white p-4 rounded-lg"
      >
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Loading 3D Gallery...</span>
        </div>
      </div>

      {/* Gallery Info Panel */}
      <div className="absolute bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-xs">
        <h3 className="text-lg font-bold mb-2">Gallery Controls</h3>
        <div className="space-y-1 text-sm">
          <p>
            <b>W/A/S/D:</b> Move around
          </p>
          <p>
            <b>Mouse:</b> Look around
          </p>
          <p>
            <b>Click:</b> Lock pointer & start moving
          </p>
          <p>
            <b>Get Close:</b> View AI story
          </p>
          <p>
            <b>ESC:</b> Unlock pointer
          </p>
        </div>
      </div>

      {/* Painting Info Panel */}
      <div
        id="painting-info"
        className="absolute top-20 left-4 bg-black/90 text-white p-6 rounded-xl max-w-md opacity-0 transition-all duration-300 transform translate-y-4 shadow-2xl border border-white/10"
      >
        <h3 id="painting-title" className="text-2xl font-bold mb-3 text-white"></h3>
        <p id="painting-artist" className="text-sm text-blue-200 mb-3 font-medium"></p>
        <p id="painting-description" className="text-sm leading-relaxed text-gray-100"></p>
      </div>
    </div>
  );
}

// Helper functions (simplified versions of the original modules)
function createPaintings(
  scene: THREE.Scene,
  paintingData: PaintingData[]
): THREE.Group[] {
  const textureLoader = new THREE.TextureLoader();
  const paintings: THREE.Group[] = [];

  paintingData.forEach((data, index) => {
    console.log(
      `Loading texture ${index + 1}/${paintingData.length}: ${data.imgSrc}`
    );
    console.log(`Full URL: ${window.location.origin}${data.imgSrc}`);

    // Load texture with proper settings
    const texture = textureLoader.load(
      data.imgSrc,
      (texture) => {
        // On load success
        console.log(`✅ Texture loaded successfully: ${data.imgSrc}`);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = true; // Fix upside down images
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.needsUpdate = true;
      },
      (progress) => {
        // On progress
        console.log(
          `Loading progress for ${data.imgSrc}: ${
            (progress.loaded / progress.total) * 100
          }%`
        );
      },
      (error) => {
        // On error - create a fallback texture
        console.error(`❌ Error loading texture: ${data.imgSrc}`, error);
        console.log(`Creating fallback texture for: ${data.imgSrc}`);
      }
    );

    // Set texture properties immediately
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = true; // Fix upside down images
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    // Create material with proper settings
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: false,
      side: THREE.FrontSide, // Only render front side to avoid z-fighting
      depthWrite: true,
      depthTest: true,
    });

    // Create frame geometry (slightly larger than the image)
    const frameWidth = data.width + 0.2;
    const frameHeight = data.height + 0.2;
    const frameGeometry = new THREE.PlaneGeometry(frameWidth, frameHeight);

    // Create frame material (dark wood color)
    const frameMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b4513, // Brown wood color
      side: THREE.FrontSide,
    });

    // Create the frame
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);

    // Create painting geometry (slightly smaller than frame)
    const paintingGeometry = new THREE.PlaneGeometry(data.width, data.height);
    const painting = new THREE.Mesh(paintingGeometry, material);

    // Position the painting slightly in front of the frame
    painting.position.z = 0.01;

    // Create a group to hold both frame and painting
    const paintingGroup = new THREE.Group();
    paintingGroup.add(frame);
    paintingGroup.add(painting);

    // Position the painting group slightly in front of the wall to avoid z-fighting
    const wallOffset = 0.01; // Small offset to place painting in front of wall
    let adjustedPosition = { ...data.position };

    // Adjust position based on wall orientation
    if (data.rotationY === 0) {
      // Front wall - move painting slightly forward
      adjustedPosition.z += wallOffset;
    } else if (data.rotationY === Math.PI) {
      // Back wall - move painting slightly backward
      adjustedPosition.z -= wallOffset;
    } else if (data.rotationY === Math.PI / 2) {
      // Left wall - move painting slightly left
      adjustedPosition.x -= wallOffset;
    } else if (data.rotationY === -Math.PI / 2) {
      // Right wall - move painting slightly right
      adjustedPosition.x += wallOffset;
    }

    paintingGroup.position.set(
      adjustedPosition.x,
      adjustedPosition.y,
      adjustedPosition.z
    );
    paintingGroup.rotation.y = data.rotationY;

    paintingGroup.userData = {
      type: "painting",
      info: data.info,
      url: data.info.link,
    };

    // Set shadow properties for both frame and painting
    frame.castShadow = true;
    frame.receiveShadow = true;
    painting.castShadow = true;
    painting.receiveShadow = true;

    paintingGroup.renderOrder = 1; // Render paintings after walls

    paintings.push(paintingGroup);
    scene.add(paintingGroup);
  });

  return paintings;
}

function createWalls(scene: THREE.Scene): THREE.Mesh[] {
  const textureLoader = new THREE.TextureLoader();
  const walls: THREE.Mesh[] = [];

  // Wall texture
  const wallTexture = textureLoader.load("/gallery-assets/img/wall.jpg");
  wallTexture.wrapS = THREE.RepeatWrapping;
  wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(4, 4);

  const wallMaterial = new THREE.MeshLambertMaterial({ map: wallTexture });

  // Create walls - positioned slightly behind where paintings will be
  const wallPositions = [
    { x: 0, y: 5, z: -20.1, width: 40, height: 10, depth: 0.2 }, // Front wall
    { x: 0, y: 5, z: 20.1, width: 40, height: 10, depth: 0.2 }, // Back wall
    { x: -20.1, y: 5, z: 0, width: 0.2, height: 10, depth: 40 }, // Left wall
    { x: 20.1, y: 5, z: 0, width: 0.2, height: 10, depth: 40 }, // Right wall
  ];

  wallPositions.forEach((pos) => {
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(pos.width, pos.height, pos.depth),
      wallMaterial
    );
    wall.position.set(pos.x, pos.y, pos.z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    walls.push(wall);
    scene.add(wall);
  });

  return walls;
}

function setupLighting(scene: THREE.Scene, paintings: THREE.Group[]): void {
  // Ambient light - reduced since we have ceiling lights now
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Main directional light (sunlight through windows)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -25;
  directionalLight.shadow.camera.right = 25;
  directionalLight.shadow.camera.top = 25;
  directionalLight.shadow.camera.bottom = -25;
  scene.add(directionalLight);

  // Additional fill light
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.2);
  fillLight.position.set(-10, 5, -5);
  scene.add(fillLight);

  // Spot lights for each painting to highlight them
  paintings.forEach((painting, index) => {
    const spotLight = new THREE.SpotLight(0xffffff, 0.5, 15, Math.PI / 6, 0.3);
    spotLight.position.set(
      painting.position.x,
      painting.position.y + 3,
      painting.position.z + 1
    );
    spotLight.target.position.set(
      painting.position.x,
      painting.position.y,
      painting.position.z
    );
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);
    scene.add(spotLight.target);
  });
}

function setupFloor(scene: THREE.Scene): void {
  const textureLoader = new THREE.TextureLoader();
  const floorTexture = textureLoader.load("/gallery-assets/img/Floor.jpg");
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(8, 8);

  const floorMaterial = new THREE.MeshLambertMaterial({ map: floorTexture });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
}

function createCeiling(scene: THREE.Scene): void {
  const textureLoader = new THREE.TextureLoader();
  const ceilingTexture = textureLoader.load("/gallery-assets/img/ceiling.jpg");
  ceilingTexture.wrapS = THREE.RepeatWrapping;
  ceilingTexture.wrapT = THREE.RepeatWrapping;
  ceilingTexture.repeat.set(4, 4);

  const ceilingMaterial = new THREE.MeshLambertMaterial({
    map: ceilingTexture,
  });
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    ceilingMaterial
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 10;
  scene.add(ceiling);
}

function createCeilingLights(scene: THREE.Scene): void {
  // Create multiple ceiling lights for better illumination
  const lightPositions = [
    { x: -10, z: -10 },
    { x: 10, z: -10 },
    { x: -10, z: 10 },
    { x: 10, z: 10 },
    { x: 0, z: 0 }, // Center light
  ];

  lightPositions.forEach((pos) => {
    // Create light fixture geometry
    const fixtureGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const fixtureMaterial = new THREE.MeshBasicMaterial({
      color: 0x333333, // Dark metal color
      transparent: true,
      opacity: 0.8,
    });
    const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
    fixture.position.set(pos.x, 9.8, pos.z);
    scene.add(fixture);

    // Create light bulb
    const bulbGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const bulbMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffcc, // Warm white light
      transparent: true,
      opacity: 0.9,
    });
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.set(pos.x, 9.6, pos.z);
    scene.add(bulb);

    // Add point light for illumination
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 20);
    pointLight.position.set(pos.x, 9.5, pos.z);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 25;
    scene.add(pointLight);
  });
}

function createPlants(scene: THREE.Scene): void {
  // Plant positions in corners and along walls
  const plantPositions = [
    { x: -18, z: -18 }, // Front-left corner
    { x: 18, z: -18 }, // Front-right corner
    { x: -18, z: 18 }, // Back-left corner
    { x: 18, z: 18 }, // Back-right corner
    { x: -18, z: 0 }, // Left wall center
    { x: 18, z: 0 }, // Right wall center
  ];

  plantPositions.forEach((pos, index) => {
    // Create plant group
    const plantGroup = new THREE.Group();

    // Create plant pot
    const potGeometry = new THREE.CylinderGeometry(0.8, 1.0, 1.2, 16);
    const potMaterial = new THREE.MeshLambertMaterial({
      color: 0x8b4513, // Terracotta color
    });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = 0.6;
    pot.castShadow = true;
    pot.receiveShadow = true;
    plantGroup.add(pot);

    // Create soil in pot
    const soilGeometry = new THREE.CylinderGeometry(0.7, 0.9, 0.2, 16);
    const soilMaterial = new THREE.MeshLambertMaterial({
      color: 0x654321, // Dark brown soil
    });
    const soil = new THREE.Mesh(soilGeometry, soilMaterial);
    soil.position.y = 1.1;
    soil.castShadow = true;
    soil.receiveShadow = true;
    plantGroup.add(soil);

    // Create main plant stem
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.15, 2.5, 8);
    const stemMaterial = new THREE.MeshLambertMaterial({
      color: 0x228b22, // Forest green
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 2.35;
    stem.castShadow = true;
    stem.receiveShadow = true;
    plantGroup.add(stem);

    // Create leaves (multiple spheres for a bushy look)
    const leafPositions = [
      { x: 0, y: 3.5, z: 0, scale: 0.8 },
      { x: 0.5, y: 3.2, z: 0.3, scale: 0.6 },
      { x: -0.4, y: 3.3, z: -0.2, scale: 0.7 },
      { x: 0.3, y: 3.8, z: -0.4, scale: 0.5 },
      { x: -0.6, y: 3.6, z: 0.2, scale: 0.6 },
      { x: 0.2, y: 4.0, z: 0.1, scale: 0.4 },
      { x: -0.3, y: 4.2, z: -0.1, scale: 0.5 },
    ];

    leafPositions.forEach((leafPos) => {
      const leafGeometry = new THREE.SphereGeometry(leafPos.scale, 8, 6);
      const leafMaterial = new THREE.MeshLambertMaterial({
        color: 0x32cd32, // Lime green
      });
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.set(leafPos.x, leafPos.y, leafPos.z);
      leaf.castShadow = true;
      leaf.receiveShadow = true;
      plantGroup.add(leaf);
    });

    // Add some variation to each plant
    const rotationY = (index * Math.PI * 2) / plantPositions.length;
    plantGroup.rotation.y = rotationY;

    // Slight random scale variation
    const scale = 0.8 + Math.random() * 0.4;
    plantGroup.scale.set(scale, scale, scale);

    // Position the plant
    plantGroup.position.set(pos.x, 0, pos.z);
    scene.add(plantGroup);
  });

  // Add some smaller decorative plants
  const smallPlantPositions = [
    { x: -15, z: -15 },
    { x: 15, z: -15 },
    { x: -15, z: 15 },
    { x: 15, z: 15 },
  ];

  smallPlantPositions.forEach((pos, index) => {
    const smallPlantGroup = new THREE.Group();

    // Small pot
    const smallPotGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.6, 12);
    const smallPotMaterial = new THREE.MeshLambertMaterial({
      color: 0xcd853f, // Peru color
    });
    const smallPot = new THREE.Mesh(smallPotGeometry, smallPotMaterial);
    smallPot.position.y = 0.3;
    smallPot.castShadow = true;
    smallPot.receiveShadow = true;
    smallPlantGroup.add(smallPot);

    // Small plant
    const smallStemGeometry = new THREE.CylinderGeometry(0.05, 0.08, 1.2, 6);
    const smallStemMaterial = new THREE.MeshLambertMaterial({
      color: 0x228b22,
    });
    const smallStem = new THREE.Mesh(smallStemGeometry, smallStemMaterial);
    smallStem.position.y = 1.2;
    smallStem.castShadow = true;
    smallStem.receiveShadow = true;
    smallPlantGroup.add(smallStem);

    // Small leaves
    for (let i = 0; i < 4; i++) {
      const smallLeafGeometry = new THREE.SphereGeometry(0.3, 6, 4);
      const smallLeafMaterial = new THREE.MeshLambertMaterial({
        color: 0x32cd32,
      });
      const smallLeaf = new THREE.Mesh(smallLeafGeometry, smallLeafMaterial);
      const angle = (i * Math.PI * 2) / 4;
      smallLeaf.position.set(
        Math.cos(angle) * 0.2,
        1.5 + Math.random() * 0.3,
        Math.sin(angle) * 0.2
      );
      smallLeaf.castShadow = true;
      smallLeaf.receiveShadow = true;
      smallPlantGroup.add(smallLeaf);
    }

    // Position small plant
    smallPlantGroup.position.set(pos.x, 0, pos.z);
    smallPlantGroup.scale.set(0.7, 0.7, 0.7);
    scene.add(smallPlantGroup);
  });
}

function setupEventListeners(
  controls: PointerLockControls,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  paintings: THREE.Group[],
  movementState: any
): (() => void) | undefined {
  // Click handling for camera lock
  function onMouseClick() {
    if (!controls.isLocked) {
      controls.lock();
      return;
    }
  }

  // Keyboard controls
  function onKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case "KeyW":
        movementState.moveForward = true;
        break;
      case "KeyS":
        movementState.moveBackward = true;
        break;
      case "KeyA":
        movementState.moveLeft = true;
        break;
      case "KeyD":
        movementState.moveRight = true;
        break;
      case "Escape":
        controls.unlock();
        break;
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case "KeyW":
        movementState.moveForward = false;
        break;
      case "KeyS":
        movementState.moveBackward = false;
        break;
      case "KeyA":
        movementState.moveLeft = false;
        break;
      case "KeyD":
        movementState.moveRight = false;
        break;
    }
  }

  // Add event listeners
  renderer.domElement.addEventListener("click", onMouseClick);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Cleanup function
  return () => {
    renderer.domElement.removeEventListener("click", onMouseClick);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
  };
}

// Global variable to track current painting info
let currentPaintingInfo: any = null;
let lastProximityCheck = 0;

function hidePaintingInfo(): void {
  const infoPanel = document.getElementById("painting-info");
  if (infoPanel) {
    infoPanel.style.opacity = "0";
    infoPanel.style.transform = "translateY(1rem)";
  }
}

function showPaintingInfo(info: any): void {
  console.log("showPaintingInfo called with:", info);
  
  if (!info || typeof info !== 'object') {
    console.log("Invalid info object:", info);
    return;
  }
  
  const titleElement = document.getElementById("painting-title");
  const artistElement = document.getElementById("painting-artist");
  const descriptionElement = document.getElementById("painting-description");
  const infoPanel = document.getElementById("painting-info");

  console.log("Elements found:", { titleElement, artistElement, descriptionElement, infoPanel });

  if (titleElement && artistElement && descriptionElement && infoPanel) {
    titleElement.textContent = info.title || "Untitled";
    artistElement.textContent = info.artist || "Unknown Artist";
    descriptionElement.textContent = info.description || "No description available";

    infoPanel.style.opacity = "1";
    infoPanel.style.transform = "translateY(0)";

    console.log("Painting info displayed:", { title: info.title, artist: info.artist });

    // Hide after 8 seconds
    setTimeout(() => {
      infoPanel.style.opacity = "0";
      infoPanel.style.transform = "translateY(1rem)";
    }, 8000);
  } else {
    console.log("Could not find required DOM elements");
  }
}
