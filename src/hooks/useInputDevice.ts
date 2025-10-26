import { useEffect, useState } from 'react';

export function useInputDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    setIsTouch(checkTouch());

    // Handle hybrid devices dynamically
    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') setIsTouch(true);
      else if (e.pointerType === 'mouse') setIsTouch(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return isTouch;
}
