import React, { useState } from 'react';

export default function FixedLogo() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col items-center mb-4">
      {!imageError ? (
        <img
          src="/logo.png"
          alt="HidroMineral - Mineralizador de Água"
          className="h-32 w-auto object-contain max-w-full"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex items-center justify-center h-32 w-64 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg shadow-lg">
          <div className="text-center px-4">
            <div className="text-4xl font-bold text-white tracking-wider">
              HidroMineral
            </div>
            <div className="text-sm text-cyan-100 mt-1">
              Mineralizador de Água
            </div>
          </div>
        </div>
      )}
    </div>
  );
}