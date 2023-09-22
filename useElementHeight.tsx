import { RefObject, useEffect, useState, useCallback } from "react";

export default function useElementHeight(ref: RefObject<HTMLElement>) {
  
  const [height, setHeight] = useState<number>(0); // holds the current height
  const node = ref.current;

  const getHeight = useCallback(() => {
    if (!node) {
      return;
    }
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const elemHeight = entry.borderBoxSize[0].blockSize;
        // Only set the new height if it's different
        if(height !== elemHeight) {
          setHeight(elemHeight);
        }
      }
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [node, height]);

  useEffect(() => {
    getHeight();
  }, [getHeight]);

  return height; // Changed to `height` to reflect the new state we're returning.
}
