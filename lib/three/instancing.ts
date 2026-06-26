import * as THREE from "three";

export function setInstanceMatrix(
  mesh: THREE.InstancedMesh,
  index: number,
  position: THREE.Vector3,
  scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1)
): void {
  const matrix = new THREE.Matrix4();
  matrix.compose(position, new THREE.Quaternion(), scale);
  mesh.setMatrixAt(index, matrix);
  mesh.instanceMatrix.needsUpdate = true;
}

export function setInstanceColor(
  mesh: THREE.InstancedMesh,
  index: number,
  color: THREE.Color
): void {
  if (!mesh.instanceColor) {
    mesh.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(mesh.count * 3),
      3
    );
  }
  mesh.setColorAt(index, color);
  if (mesh.instanceColor) {
    mesh.instanceColor.needsUpdate = true;
  }
}

export function createInstancedMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  count: number
): THREE.InstancedMesh {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;
  return mesh;
}
