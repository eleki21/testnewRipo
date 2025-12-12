import React, { useState } from 'react';

interface TooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  term,
  definition,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      <span className="tooltip-trigger">{children}</span>
      {isVisible && (
        <span className="tooltip-content">
          <strong>{term}</strong>
          <span className="tooltip-definition">{definition}</span>
        </span>
      )}
    </span>
  );
};
