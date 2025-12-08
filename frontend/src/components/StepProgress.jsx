import React, { useState } from "react";
import { Check } from "lucide-react";

const StepProgress = ({ progress }) => {
  // Generate random positions for particles once using lazy initialization
  const [particlePositions] = useState(() =>
    Array.from({ length: 12 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
    }))
  );

  return (
    <>
      <div className="relative w-full h-4 bg-white/5 backdrop-blur-2xl overflow-hidden rounded-full border border-white/10">
        <div className="absolute inset-0 bg-linear-to-r from-violet-500/20 to-fuchsia-500/20 animate-pulse" />
        {/*Main Progress Bar*/}
        <div
          className="relative h-full bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-full overflow-hidden transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            backgroundSize: "200% 100%",
          }}
        >
          <div className="absolute top-0 h-full w-4 bg-linear-to-r from-transparent to-white/50 blur-sm" />
          <div className="absolute inset-0 opacity-80">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="absolute top-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
                style={{
                  left: `${(index + 1) * 12}%`,
                  animationDelay: `${index * 0.25}s`,
                  transform: "translateY(-50%)",
                }}
              ></div>
            ))}
          </div>
          {/*Particle Effects*/}
          <div className="absolute inset-0">
            {particlePositions.map((pos, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/60 rounded-full"
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  animationDelay: `${pos.delay}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
        {progress > 0 && (
          <div
            className="absolute top-10 h-full w-8 bg-linear-to-r from-transparent to-white/50 blur-sm"
            style={{ left: `${Math.max(0, progress - 4)}%` }}
          ></div>
        )}
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="text-xs font-bold text-white/60">
          {progress < 25
            ? "Getting Started"
            : progress < 50
            ? "Making progress"
            : progress < 75
            ? "Almost There"
            : "Ready to Go!"}
        </div>
        <div className="flex items-center gap-2">
          {progress >= 100 && (
            <div className="w-6 h-6 bg-linear-to-r from-green-600 to-emerald-500 rounded-full flex items-center justify-center">
            <Check size={12} className="text-green-600" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StepProgress;
