
import React from 'react';
import ProjectionLogo from './ProjectionLogo';

interface ProjectionLoadingStateProps {
  message: string;
}

const ProjectionLoadingState = ({ message }: ProjectionLoadingStateProps) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <ProjectionLogo />
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default ProjectionLoadingState;
