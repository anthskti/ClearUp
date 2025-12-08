import React from "react";

interface WaveProps {
  className?: string;
  fill?: string;
  value?: string;
  height?: string;
}

const WaveBackground: React.FC<WaveProps> = ({
  className = "absolute top-0 left-0 w-full z-0",
  fill = "fill-blue-100",
  value = "1440",
  height = "h-[200px]",
}) => {
  return (
    <div className={`overflow-hidden leading-0 w-full ${height} ${className}`}>
      <svg
        className="h-full min-w-[2000px] block absolute left-1/2 -translate-x-1/2"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${value} 320`}
        preserveAspectRatio="none"
      >
        <path
          d="M0,288L60,245.3C120,203,240,117,360,112C480,107,600,181,720,181.3C840,181,960,107,1080,106.7C1200,107,1320,181,1380,218.7L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          className={fill}
        ></path>
      </svg>
    </div>
  );
};

export default WaveBackground;
