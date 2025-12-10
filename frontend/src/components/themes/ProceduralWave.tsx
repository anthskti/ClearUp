import React, { useMemo } from "react";

// Set math.sin to fixedAt(2) for hydration consistency

interface ProceduralWaveProps {
  className?: string;
  fill?: string;
  height?: number; // Height of the SVG container
  width?: number; // Width of the SVG container
  amplitude?: number; // How tall
  frequency?: number; // How many bumps
  offset?: number; // Phase shift
  seed?: number; // Randomness; Use this the most
  flip?: boolean; // Toggle between Top and Bottom
}

const ProceduralWave: React.FC<ProceduralWaveProps> = ({
  className = "absolute top-0 z-0 w-full",
  fill = "fill-[#e8f6ff]",
  height = 180,
  width = 1440,
  amplitude = 10,
  frequency = 3,
  offset = 0,
  seed = 5,
  flip = true,
}) => {
  const pathData = useMemo(() => {
    const points = [];
    const segments = 200;
    const waveHeight = height / 2;

    // --- START POINT ---
    // If flip is true, start at Top-Left (0,0). If false, Bottom-Left (0, height)
    points.push(flip ? `M 0 0` : `M 0 ${height}`);

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const normalizedX = i / segments;

      // The Random/Harmonic Math
      const y1 = Math.sin(
        normalizedX * Math.PI * 2 * frequency + offset + seed
      );
      const y2 =
        Math.sin(
          normalizedX * Math.PI * 2 * (frequency * 1.2) + offset + seed * 2
        ) * 0.5;
      const y3 =
        Math.sin(
          normalizedX * Math.PI * 2 * (frequency * 2.1) + offset + seed * 3
        ) * 0.2;

      const combinedY = (y1 + y2 + y3) * amplitude;
      const finalY = waveHeight - combinedY;

      // --- HYDRATION FIX IS HERE ---
      // We round values to 2 decimal places to ensure Server and Client match perfectly.
      points.push(`L ${x.toFixed(2)} ${finalY.toFixed(2)}`);
    }

    // --- END POINT ---
    // If flip is true, close at Top-Right (width, 0). If false, Bottom-Right (width, height)
    points.push(flip ? `L ${width} 0` : `L ${width} ${height}`);

    points.push(`Z`); // Close path

    return points.join(" ");
  }, [width, height, amplitude, frequency, offset, seed, flip]);

  return (
    <div
      className={`${className} overflow-hidden`}
      style={{ height: `${height}px` }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={pathData} className={fill} />
      </svg>
    </div>
  );
};

export default ProceduralWave;
