export function generateFibonacciSphere(samples: number, radius: number) {
  const points: { position: [number, number, number]; id: string }[] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1); // golden angle in radians

  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
    const r = Math.sqrt(1 - y * y); // radius at y

    const theta = phi * i; // golden angle increment

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    points.push({
      position: [x * radius, y * radius, z * radius],
      id: `panel-${i}`,
    });
  }
  return points;
}
