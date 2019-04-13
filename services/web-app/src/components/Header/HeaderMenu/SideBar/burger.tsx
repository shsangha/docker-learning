import React from "react";

export default ({ className }: { className: string }) => (
  <svg
    id="burger"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    height={0}
    viewBox="0 0 49 24"
    role="img"
  >
    <line
      y1="0.5"
      x2="49"
      y2="0.5"
      fill="none"
      stroke="#231f20"
      strokeMiterlimit="10"
    />
    <line
      y1="12"
      x2="49"
      y2="12"
      fill="none"
      stroke="#231f20"
      strokeMiterlimit="10"
    />
    <line
      y1="23.5"
      x2="49"
      y2="23.5"
      fill="none"
      stroke="#231f20"
      strokeMiterlimit="10"
    />
  </svg>
);
