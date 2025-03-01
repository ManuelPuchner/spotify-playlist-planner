import { useState, useRef, useEffect } from "react";
import React from "react";

type ScrollingTextProps = {
  children: React.ReactNode;
};

export default function ScrollingText({ children }: ScrollingTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [overflowWidth, setOverflowWidth] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (container && content) {
      const containerWidth = container.offsetWidth;
      const contentWidth = content.scrollWidth;
      if (contentWidth > containerWidth) {
        const extraWidth = contentWidth - containerWidth;
        setOverflowWidth(extraWidth);
        // Adjust multiplier as needed (here: 0.03 seconds per extra pixel)
        setDuration(extraWidth * 0.03);
      } else {
        setOverflowWidth(0);
      }
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ lineHeight: 0 }}
    >
      <div
        ref={contentRef}
        className="inline-block"
        style={{
          transform: isHovered
            ? `translateX(-${overflowWidth}px)`
            : "translateX(0)",
          transition: isHovered
            ? `transform ${duration}s linear`
            : "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
