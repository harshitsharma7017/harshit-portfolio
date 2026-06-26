import * as THREE from "three";
import { driftOffset } from "@/lib/math/noise";
import { getCameraAnchorForProgress } from "./cameraPaths";

export class CameraDirector {
  private targetPosition = new THREE.Vector3(0, 2, 8);
  private targetLookAt = new THREE.Vector3(0, 0, 0);
  private currentLookAt = new THREE.Vector3(0, 0, 0);
  private targetFov = 50;
  private time = 0;

  setProgress(progress: number): void {
    const anchor = getCameraAnchorForProgress(progress);
    this.targetPosition.set(...anchor.position);
    this.targetLookAt.set(...anchor.lookAt);
    this.targetFov = anchor.fov;
  }

  update(
    camera: THREE.PerspectiveCamera,
    delta: number,
    driftAmplitude = 0.08
  ): void {
    this.time += delta;

    const driftX = driftOffset(this.time, 1, driftAmplitude);
    const driftY = driftOffset(this.time, 2, driftAmplitude * 0.5);

    camera.position.lerp(
      this.targetPosition.clone().add(new THREE.Vector3(driftX, driftY, 0)),
      0.04
    );

    this.currentLookAt.lerp(this.targetLookAt, 0.04);
    camera.lookAt(this.currentLookAt);
    camera.fov = THREE.MathUtils.lerp(camera.fov, this.targetFov, 0.04);
    camera.updateProjectionMatrix();
  }
}

export const cameraDirector = new CameraDirector();
