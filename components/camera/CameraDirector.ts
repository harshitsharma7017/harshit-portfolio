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

    // Damped inertia (framerate independent, heavier feel)
    const damping = 3.5;
    const t = 1.0 - Math.exp(-damping * delta);

    // Organic breathing (cinematographer feel - slow, compound waves)
    const breathT = this.time * 0.6;
    const driftX = driftOffset(breathT, 1, driftAmplitude) + Math.sin(breathT * 0.4) * (driftAmplitude * 0.3);
    const driftY = driftOffset(breathT, 2, driftAmplitude * 0.8) + Math.cos(breathT * 0.3) * (driftAmplitude * 0.4);

    const finalTargetPos = this.targetPosition.clone().add(new THREE.Vector3(driftX, driftY, 0));

    camera.position.lerp(finalTargetPos, t);
    this.currentLookAt.lerp(this.targetLookAt, t);
    
    camera.lookAt(this.currentLookAt);
    camera.fov = THREE.MathUtils.lerp(camera.fov, this.targetFov, t);
    camera.updateProjectionMatrix();
  }
}

export const cameraDirector = new CameraDirector();
