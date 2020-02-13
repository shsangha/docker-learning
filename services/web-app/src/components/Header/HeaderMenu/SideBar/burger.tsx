import React from "react";

export default ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 103"
    role="img"
  >
    <line y1="1.5" x1="0" x2="300" y2="1.5" fill="#000" stroke="#000" />
    <line y1="51.5" x1="0" x2="200" y2="51.5" fill="#000" stroke="#000" />
    <line y1="101.5" x2="300" y2="101.5" fill="#000" stroke="#000" />
  </svg>
);
