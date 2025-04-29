
import React from 'react';

const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-primary rounded-full mx-auto mb-4 animate-spin"></div>
        <p className="text-lg">Loading your financial dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingState;
