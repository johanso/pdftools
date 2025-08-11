// src/components/shared/Loader.tsx
import React from 'react';

const Loader = ({ text }: { text: string }) => {
  const loaderStyle: React.CSSProperties = {
    '--c': 'no-repeat linear-gradient(black 0 0)',
    background: [
      'var(--c) 0 0',
      'var(--c) 0 50%',
      'var(--c) 0 100%',
      'var(--c) 50% 0',
      'var(--c) 50% 50%',
      'var(--c) 50% 100%',
      'var(--c) 100% 0',
      'var(--c) 100% 50%',
      'var(--c) 100% 100%'
    ].join(','),
    backgroundSize: '10px 10px',
    animation: 'animated .7s infinite alternate',
    width: '1rem',
    height: '1rem',
    margin: 'auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  } as React.CSSProperties;

  const keyframes = `
    @keyframes animated {
      0%,20% { width: 1rem; height: 1rem; }
      90%,100% { width: 2.5rem; height: 2.5rem; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div className="flex items-center justify-center h-full">
        <div style={loaderStyle}></div>
        <div className="mt-20 text-sm">{text}</div>
      </div>

    </>
  );
};

export default Loader;
