
import React from 'react';

const ProjectionLogo = () => {
  return (
    <div className="absolute top-4 right-4 z-20">
      <img 
        src="/ChatGPT Image 13 juin 2025, 15_24_09.png" 
        alt="Logo" 
        className="h-48 w-auto"
        onError={(e) => {
          console.error('Logo failed to load:', e);
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default ProjectionLogo;
