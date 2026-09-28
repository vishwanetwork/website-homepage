import React from 'react';

// Reference icons from an external sprite to avoid inlining large SVGs in JSX
export default function Icon({ name, className = '' }) {
  return (
    <svg className={`icon ${className}`.trim()} aria-hidden="true">
      <use href={`/assets/icons/sprite.svg#i-${name}`} />
    </svg>
  );
}
