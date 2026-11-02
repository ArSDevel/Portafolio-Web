"use client";

import { Grid, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useMemo } from "react";
import { Box3, Sphere, Vector3, type Material, type Mesh, type PerspectiveCamera } from "three";

export type ModelStats = {
  triangles: number;
  vertices: number;
  meshes: number;
  materials: number;
};

type Props = {
  url: string;
  wireframe: boolean;
  autoRotate: boolean;
  resetKey: number;
  onStats: (stats: ModelStats) => void;
};

const VIEW_DIR = new Vector3(1, 0.65, 1.3).normalize();
const MARGIN = 1.25;

function Model({ url, wireframe, resetKey, onStats }: Omit<Props, "autoRotate">) {
  const { scene } = useGLTF(url);
  // Read the live three.js state inside effects (camera/controls are meant to be mutated).
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);

  // Clone, then sit the model on the grid (bottom at y=0, centered on x/z).
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const center = box.getCenter(new Vector3());
    clone.position.sub(new Vector3(center.x, box.min.y, center.z));
    return clone;
  }, [scene]);

  // Frame the camera instantly around the model's bounding sphere,
  // using the narrower of the vertical/horizontal field of view.
  useLayoutEffect(() => {
    const state = get();
    const camera = state.camera as PerspectiveCamera;
    const controls = state.controls as unknown as { target: Vector3; update: () => void } | null;
    const sphere = new Box3().setFromObject(model).getBoundingSphere(new Sphere());
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (size.width / size.height));
    const distance = (sphere.radius * MARGIN) / Math.sin(Math.min(vFov, hFov) / 2);

    camera.position.copy(sphere.center).addScaledVector(VIEW_DIR, distance);
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
    if (controls) {
      controls.target.copy(sphere.center);
      controls.update();
    } else {
      camera.lookAt(sphere.center);
    }
  }, [model, get, size.width, size.height, resetKey]);

  // Count geometry straight from the file, so the numbers always match the real model.
  useEffect(() => {
    let triangles = 0;
    let vertices = 0;
    let meshes = 0;
    const materials = new Set<Material>();
    model.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      meshes++;
      const geo = mesh.geometry;
      const count = geo.index ? geo.index.count : geo.attributes.position.count;
      triangles += count / 3;
      vertices += geo.attributes.position.count;
      [mesh.material].flat().forEach((m) => materials.add(m));
    });
    onStats({ triangles: Math.round(triangles), vertices, meshes, materials: materials.size });
  }, [model, onStats]);

  useEffect(() => {
    model.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      [mesh.material].flat().forEach((m) => {
        (m as Material & { wireframe?: boolean }).wireframe = wireframe;
      });
    });
  }, [model, wireframe]);

  return <primitive object={model} />;
}

export default function ModelScene({ url, wireframe, autoRotate, resetKey, onStats }: Props) {
  return (
    <Canvas camera={{ position: [4, 3, 5], fov: 40 }} dpr={[1, 2]}>
      <color attach="background" args={["#15121e"]} />
      <hemisphereLight args={["#ffffff", "#2a2540", 1.4]} />
      <directionalLight position={[5, 8, 4]} intensity={2.2} />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#b79cff" />

      <Suspense fallback={null}>
        <Model url={url} wireframe={wireframe} resetKey={resetKey} onStats={onStats} />
      </Suspense>

      <Grid
        args={[20, 20]}
        cellSize={0.5}
        cellColor="#2a2540"
        sectionSize={2}
        sectionColor="#b79cff"
        sectionThickness={1}
        fadeDistance={18}
        infiniteGrid
      />
      <OrbitControls makeDefault autoRotate={autoRotate} autoRotateSpeed={1.2} enableDamping />
    </Canvas>
  );
}
