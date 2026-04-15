"use client";

const LoadingDots = ({ className }: { className?: string }) => {
  return (
    <div className={`animate-pulse flex space-x-1 ${className || ""}`}>
      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
    </div>
  );
};

export default LoadingDots;
