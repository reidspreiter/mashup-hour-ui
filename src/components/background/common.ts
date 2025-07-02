export const drawSpectrumAnalyzer = (
  context: CanvasRenderingContext2D,
  lineThickness: number,
  solidColor: string,
  values: number[],
  canvasHeight: number,
  canvasWidth: number
) => {
  context.beginPath();
  context.lineWidth = lineThickness;
  context.strokeStyle = solidColor;

  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const normalizedMagnitude = Math.max(0, (value + 100) / 100);
    const pointHeight = normalizedMagnitude * canvasHeight;
    const x = (i / values.length) * canvasWidth;
    const y = canvasHeight - pointHeight - 10;
    if (i === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }
  context.stroke();
};

export const drawFrequencyGateBar = (
  context: CanvasRenderingContext2D,
  state: boolean,
  gateX: number,
  gateY: number,
  tolerance: number,
  numBands: number,
  canvasWidth: number,
  canvasHeight: number
) => {
  context.beginPath();
  context.lineWidth = 4;
  context.strokeStyle = state ? "green" : "red";

  const start = (Math.max(0, gateX - tolerance) / numBands) * canvasWidth;
  const end = (Math.min(numBands - 1, gateX + tolerance) / numBands) * canvasWidth;
  const normalizedMagnitude = Math.max(0, (gateY + 100) / 100);
  const pointHeight = normalizedMagnitude * canvasHeight;
  const y = canvasHeight - pointHeight - 10;

  context.moveTo(start, y);
  context.lineTo(end, y);
  context.stroke();
};
