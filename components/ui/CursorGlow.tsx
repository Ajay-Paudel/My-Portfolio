import React, { useEffect, useRef } from 'react';

export const CursorGlow: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let isVisible = false;

    const updateCursor = (e: MouseEvent) => {
      if (!isVisible) {
        cursor.style.opacity = '1';
        isVisible = true;
      }
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
      isVisible = false;
    };

    window.addEventListener('mousemove', updateCursor, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="cursor-glow fixed top-0 left-0 pointer-events-none hidden md:block opacity-0 will-change-transform"
      style={{
        // Initial position off-screen or handled via transform
        transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' 
      }}
    />
  );
};