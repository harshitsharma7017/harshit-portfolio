import type { BufferGeometry, Material, Object3D, Texture } from "three";

export function disposeMaterial(material: Material | Material[]): void {
  const materials = Array.isArray(material) ? material : [material];
  materials.forEach((mat) => {
    Object.values(mat).forEach((value) => {
      if (value instanceof Object && "isTexture" in value && (value as Texture).dispose) {
        (value as Texture).dispose();
      }
    });
    mat.dispose();
  });
}

export function disposeObject3D(object: Object3D): void {
  object.traverse((child) => {
    if ("geometry" in child && child.geometry) {
      (child.geometry as BufferGeometry).dispose();
    }
    if ("material" in child && child.material) {
      disposeMaterial(child.material as Material | Material[]);
    }
  });
}
