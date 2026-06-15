import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// --- Procedural Terrain Generation ---
// Deterministic terrain height function accessible on both CPU & GPU (via JS)
export function getTerrainHeight(x, z) {
  // Large landscape contours
  let height = Math.sin(x * 0.01) * Math.cos(z * 0.01) * 12;
  // Medium hills/dunes
  height += Math.sin(x * 0.04 + 1.0) * Math.sin(z * 0.03 + 2.0) * 4;
  // Small rocky ripples
  height += Math.cos(x * 0.15) * Math.sin(z * 0.12) * 0.8;
  height += Math.sin(x * 0.4) * Math.cos(z * 0.4) * 0.25;

  // Boundary wall / Crater rim
  const distFromCenter = Math.sqrt(x * x + z * z);
  const playRadius = 240;
  if (distFromCenter > playRadius) {
    const edgeFactor = Math.min(1, (distFromCenter - playRadius) / 40);
    height += edgeFactor * edgeFactor * 50; // Rising ridges at boundary
  }

  // Scattered craters
  const craters = [
    { cx: 40, cz: 40, r: 30, depth: 7 },
    { cx: -60, cz: -80, r: 40, depth: 10 },
    { cx: 80, cz: -90, r: 22, depth: 5 },
    { cx: -90, cz: 60, r: 35, depth: 9 },
    { cx: 10, cz: -110, r: 28, depth: 6.5 }
  ];

  for (const c of craters) {
    const dx = x - c.cx;
    const dz = z - c.cz;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < c.r) {
      const normDist = dist / c.r;
      // raised rim
      const rim = Math.max(0, 1.0 - Math.abs(normDist - 0.9) * 10) * (c.depth * 0.25);
      // hollow floor
      const floor = (1.0 - normDist * normDist) * -c.depth;
      height += floor + rim;
    }
  }

  return height;
}

// --- Keyboard Controls Hook ---
function useControls() {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      let key = null;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') key = 'forward';
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') key = 'backward';
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') key = 'left';
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') key = 'right';

      if (key) {
        setKeys((prev) => ({ ...prev, [key]: true }));
      }
    };

    const handleKeyUp = (e) => {
      let key = null;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') key = 'forward';
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') key = 'backward';
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') key = 'left';
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') key = 'right';

      if (key) {
        setKeys((prev) => ({ ...prev, [key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}

// --- Rocks Mesh Component ---
// Renders scattered rocks with flat shading for low-poly space styling
function ScatteredRocks({ rocks }) {
  const geom = useMemo(() => new THREE.DodecahedronGeometry(1, 1), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#6e453b',
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true,
      }),
    []
  );

  return (
    <group>
      {rocks.map((rock) => (
        <mesh
          key={rock.id}
          position={rock.position}
          scale={rock.scale}
          rotation={rock.rotation}
          geometry={geom}
          material={mat}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

// --- Dynamic Terrain Component ---
function Terrain() {
  const geom = useMemo(() => {
    // Large landscape grid
    const g = new THREE.PlaneGeometry(600, 600, 180, 180);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = getTerrainHeight(x, z);
      pos.setY(i, y);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c46645',
        roughness: 0.9,
        metalness: 0.05,
        flatShading: true, // beautiful Mars low-poly look
      }),
    []
  );

  return <mesh geometry={geom} material={mat} receiveShadow />;
}

// --- Distant Mars Sun ---
function Sun() {
  return (
    <mesh position={[150, 60, -250]}>
      <sphereGeometry args={[12, 16, 16]} />
      <meshBasicMaterial color="#ffd8c2" fog={false} />
    </mesh>
  );
}

// --- Simulation Controller inside Canvas ---
const MAST_HEIGHT = 1.6;
const ROVER_RADIUS = 1.4;

function RoverController({ keys, rocks, onTelemetryUpdate }) {
  const positionRef = useRef(new THREE.Vector3(0, getTerrainHeight(0, 0), 0));
  const yawRef = useRef(0); // Yaw angle facing direction
  const speedRef = useRef(0);
  const distanceRef = useRef(0);

  const targetSpeed = keys.forward ? 5.5 : keys.backward ? -3.0 : 0;
  const turnSpeed = 1.3; // Rad/sec

  useFrame(({ clock, camera }, delta) => {
    // 1. Rotate view
    if (keys.left) {
      yawRef.current += turnSpeed * delta;
    }
    if (keys.right) {
      yawRef.current -= turnSpeed * delta;
    }

    // 2. Smoothly accelerate speed
    const accelRate = targetSpeed !== 0 ? 5.0 : 8.0;
    speedRef.current += (targetSpeed - speedRef.current) * accelRate * delta;

    // 3. Move rover position
    const dx = Math.sin(yawRef.current);
    const dz = Math.cos(yawRef.current);
    const stepSize = speedRef.current * delta;

    const nextX = positionRef.current.x + dx * stepSize;
    const nextZ = positionRef.current.z + dz * stepSize;

    // 4. Boundary checking
    const distFromCenter = Math.sqrt(nextX * nextX + nextZ * nextZ);
    let collision = distFromCenter > 270; // Map limit

    // 5. Collision checking with rocks
    if (!collision) {
      for (const rock of rocks) {
        const rx = rock.position[0];
        const rz = rock.position[2];
        const rockRadius = rock.scale * 0.75;
        const distToRock = Math.sqrt((nextX - rx) ** 2 + (nextZ - rz) ** 2);
        if (distToRock < ROVER_RADIUS + rockRadius) {
          collision = true;
          // Bounce back slightly
          speedRef.current = -speedRef.current * 0.4;
          break;
        }
      }
    }

    // 6. Update coordinates if safe
    if (!collision && Math.abs(stepSize) > 0.0001) {
      positionRef.current.x = nextX;
      positionRef.current.z = nextZ;
      distanceRef.current += Math.abs(stepSize);
    }

    // 7. Update Rover height
    positionRef.current.y = getTerrainHeight(positionRef.current.x, positionRef.current.z);

    // 8. Dynamic Camera positioning & Bobbing
    const time = clock.getElapsedTime();
    const isMoving = Math.abs(speedRef.current) > 0.1;

    // Fast high-frequency engine vibration + slow drive sway
    const bobY = isMoving
      ? Math.sin(time * 15.0) * 0.02 + Math.cos(time * 6.0) * 0.03
      : Math.sin(time * 2.0) * 0.005; // Idle rumble
    const bobX = isMoving
      ? Math.cos(time * 8.5) * 0.015
      : 0;

    const lookAheadDist = 3.0;
    const aheadX = positionRef.current.x + dx * lookAheadDist;
    const aheadZ = positionRef.current.z + dz * lookAheadDist;
    const aheadY = getTerrainHeight(aheadX, aheadZ);

    // Rover tilt pitch calculation based on slope ahead
    const slopePitch = (aheadY - positionRef.current.y) * 0.15;

    // Position camera
    camera.position.set(
      positionRef.current.x + bobX,
      positionRef.current.y + MAST_HEIGHT + bobY,
      positionRef.current.z
    );

    // Look at target direction (mast yaw + pitch tilt)
    const lookTarget = new THREE.Vector3(
      positionRef.current.x + Math.sin(yawRef.current),
      positionRef.current.y + MAST_HEIGHT + slopePitch - 0.1,
      positionRef.current.z + Math.cos(yawRef.current)
    );

    camera.lookAt(lookTarget);

    // Send data to HUD
    onTelemetryUpdate({
      x: positionRef.current.x,
      z: positionRef.current.z,
      yaw: yawRef.current,
      speed: speedRef.current,
      distance: distanceRef.current,
    });
  });

  return null;
}

// --- Main Drive Simulator Component ---
export default function RoverSimulator() {
  const keys = useControls();
  const [telemetry, setTelemetry] = useState({
    x: 0,
    z: 0,
    yaw: 0,
    speed: 0,
    distance: 0,
  });

  // Generate Rock obstacles
  const rocks = useMemo(() => {
    const list = [];
    for (let i = 0; i < 300; i++) {
      const x = (Math.random() - 0.5) * 520;
      const z = (Math.random() - 0.5) * 520;

      // Keep starting area clean of rock spawns
      if (Math.abs(x) < 12 && Math.abs(z) < 12) continue;

      const y = getTerrainHeight(x, z);
      const scale = 0.5 + Math.random() * 3.5;
      const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
      list.push({ id: i, position: [x, y, z], scale, rotation });
    }
    return list;
  }, []);

  // Format compass heading
  const headingText = useMemo(() => {
    const degrees = (((telemetry.yaw * 180) / Math.PI) % 360 + 360) % 360;
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return `${directions[index]} (${Math.round(degrees)}°)`;
  }, [telemetry.yaw]);

  return (
    <div className="relative w-full h-[75vh] min-h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-[#251515] select-none">
      {/* 3D Canvas */}
      <Canvas shadows camera={{ fov: 60, near: 0.2, far: 300 }}>
        {/* Martian atmosphere colors */}
        <color attach="background" args={['#4a2a24']} />
        <fog attach="fog" args={['#4a2a24', 15, 130]} />

        {/* Ambient & Directional Sun Lighting */}
        <ambientLight intensity={0.4} color="#e5a982" />
        <directionalLight
          position={[100, 60, -150]}
          intensity={1.8}
          color="#ffd6bc"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={250}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
        />

        {/* Backdrop stars visible through thin Martian atmosphere */}
        <Stars radius={200} depth={50} count={1200} factor={4} saturation={0.5} fade speed={1} />

        <Sun />
        <Terrain />
        <ScatteredRocks rocks={rocks} />
        <RoverController keys={keys} rocks={rocks} onTelemetryUpdate={setTelemetry} />
      </Canvas>

      {/* --- Sci-Fi HUD Overlay --- */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-5 font-mono">
        {/* Scanning telemetry effect lines */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/[0.01] to-transparent bg-[size:100%_4px] opacity-40 pointer-events-none" />

        {/* HUD Top Bar */}
        <div className="flex justify-between items-start w-full relative z-10">
          {/* Telemetry feed status */}
          <div className="bg-black/60 backdrop-blur-md border border-red-500/30 rounded-lg p-3 text-red-400 text-xs shadow-lg space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold tracking-wider uppercase">Telemetry Link: Live</span>
            </div>
            <div className="text-[10px] text-slate-400">POS X: {telemetry.x.toFixed(2)}m</div>
            <div className="text-[10px] text-slate-400">POS Z: {telemetry.z.toFixed(2)}m</div>
          </div>

          {/* Compass & Mission status */}
          <div className="bg-black/60 backdrop-blur-md border border-red-500/30 rounded-lg px-4 py-3 text-center text-red-400 shadow-lg">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">Heading</div>
            <div className="text-sm font-bold tracking-wide">{headingText}</div>
          </div>
        </div>

        {/* HUD Bottom Panel */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-3 w-full relative z-10">
          {/* Controls instructions */}
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 text-slate-300 text-xs max-w-xs space-y-1.5">
            <div className="text-red-400 font-bold uppercase tracking-wider text-[11px] mb-1">Rover Controls</div>
            <div className="flex justify-between gap-6">
              <span>Drive:</span>
              <span className="text-white font-bold">W / S (or ↑ / ↓)</span>
            </div>
            <div className="flex justify-between gap-6">
              <span>Steer:</span>
              <span className="text-white font-bold">A / D (or ← / →)</span>
            </div>
            <div className="text-[10px] text-slate-500 italic mt-1 border-t border-white/5 pt-1">
              Warning: Avoid large boulders to prevent telemetry disconnect.
            </div>
          </div>

          {/* Telemetry dashboard gauges */}
          <div className="bg-black/60 backdrop-blur-md border border-red-500/30 rounded-lg p-4 text-red-400 flex gap-6 shadow-lg">
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Speed</div>
              <div className="text-xl font-bold tracking-wider">
                {Math.max(0, Math.abs(telemetry.speed)).toFixed(1)}{' '}
                <span className="text-xs text-red-400/70 font-medium">m/s</span>
              </div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Odometer</div>
              <div className="text-xl font-bold tracking-wider">
                {telemetry.distance.toFixed(1)}{' '}
                <span className="text-xs text-red-400/70 font-medium">m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
