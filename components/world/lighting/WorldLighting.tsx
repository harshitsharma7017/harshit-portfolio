export function WorldLighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[5, 10, 5]} intensity={0.4} color="#ffffff" />
    </>
  );
}
