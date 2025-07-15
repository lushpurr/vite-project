import React from 'react';

// Configuration for the number of circles
const NUMBER_OF_CIRCLES = 30; // You can adjust this number

// Helper function to generate a random number within a range
const getRandom = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const AnimatedBackground: React.FC = () => {
  // Generate an array of circle elements with random initial properties
  const circles = Array.from({ length: NUMBER_OF_CIRCLES }).map((_, i) => {
    const size = getRandom(20, 100); // Random size for the circle
    const left = getRandom(0, 100);   // Random start position (left %)
    const duration = getRandom(15, 5); // Random animation duration
    const delay = getRandom(0, 10);   // Random animation delay

    return (
      <div
        key={i}
        className="animated-circle" // Class for CSS styling
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          // Random background color or use a fixed one
          backgroundColor: `rgba(${getRandom(100, 255)}, ${getRandom(100, 255)}, ${getRandom(100, 255)}, 0.2)`,
        }}
      ></div>
    );
  });

  return (
    <div className="animated-background-container">
      {circles}
    </div>
  );
};

export default AnimatedBackground;