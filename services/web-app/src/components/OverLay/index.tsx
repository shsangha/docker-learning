import React from "react";

interface Props {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  classNames: string;
}

const Overlay: React.SFC<Props> = ({ onClick, classNames }) => (
  <div role="presentation" onClick={onClick} className={classNames} />
);

export default Overlay;
