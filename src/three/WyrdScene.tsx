import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useLowPower, useReducedMotion } from "@/hooks/use-environment";

/**
 * THE STRUCTURE — a lattice of small ivory forms held on a spherical shell.
 * It assembles, separates, and disperses as the page is scrolled: design,
 * technology and intent resolving into one object, then letting go of it.
 */

type SceneProps = { progress: React.MutableRefObject<number>; pointer: React.MutableRefObject<[number, number]> };

function Lattice({ progress, pointer, count }: SceneProps & { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const reduced = useReducedMotion();

  const seeds = useMemo(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    return Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      return {
        base: new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius),
        drift: new THREE.Vector3(
          Math.sin(i * 1.7) * 1.6,
          Math.cos(i * 2.3) * 1.4,
          Math.sin(i * 0.9) * 1.6,
        ),
        phase: (i % 40) / 40,
      };
    });
  }, [count]);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const p = progress.current;
    const [px, py] = pointer.current;

    if (group.current) {
      group.current.rotation.y += ((px * 0.5 + t * 0.04) - group.current.rotation.y) * 0.03;
      group.current.rotation.x += (-py * 0.28 - group.current.rotation.x) * 0.03;
      group.current.position.y = -p * 1.2;
    }

    const instanced = mesh.current;
    if (!instanced) return;

    // Phase: 0 forming → 0.5 separating → 1 dispersing away
    const spread = THREE.MathUtils.smoothstep(p, 0.15, 0.85);
    const scaleFade = 1 - THREE.MathUtils.smoothstep(p, 0.7, 1);

    for (let i = 0; i < seeds.length; i += 1) {
      const seed = seeds[i]!;
      const breathe = reduced ? 0 : Math.sin(t * 0.5 + seed.phase * Math.PI * 2) * 0.04;
      const radius = 1.5 + breathe;
      dummy.position.copy(seed.base).multiplyScalar(radius);
      dummy.position.addScaledVector(seed.drift, spread * 1.1);
      dummy.rotation.set(seed.phase * 6 + t * 0.06, seed.phase * 3, 0);
      const s = (0.055 + seed.phase * 0.05) * (0.35 + scaleFade * 0.65);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
    }
    instanced.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} castShadow={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#FCFAF5" roughness={0.55} metalness={0.05} />
      </instancedMesh>
      <mesh>
        <icosahedronGeometry args={[1.48, 2]} />
        <meshBasicMaterial color="#171714" wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function Rig({ pointer }: { pointer: React.MutableRefObject<[number, number]> }) {
  const { camera } = useThree();
  useFrame(() => {
    const [px, py] = pointer.current;
    camera.position.x += (px * 0.9 - camera.position.x) * 0.04;
    camera.position.y += (py * 0.6 + 0.1 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function WyrdScene({ progress, pointer }: SceneProps) {
  const low = useLowPower();
  const count = low ? 160 : 420;

  return (
    <Canvas
      dpr={[1, low ? 1.25 : 1.8]}
      gl={{ antialias: !low, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0.1, 5.2], fov: 42 }}
      frameloop="always"
    >
      <ambientLight intensity={0.85} color="#F6F2E9" />
      <directionalLight position={[3, 4, 3]} intensity={1.5} color="#FFF6EA" />
      <pointLight position={[-3.5, 1.5, 2]} intensity={9} color="#E98B73" distance={12} />
      <pointLight position={[3.5, -1.5, 1.5]} intensity={7} color="#8EB7D8" distance={12} />
      <pointLight position={[0, 2.8, -3]} intensity={6} color="#B7A8CC" distance={14} />
      <Lattice progress={progress} pointer={pointer} count={count} />
      <Rig pointer={pointer} />
    </Canvas>
  );
}
