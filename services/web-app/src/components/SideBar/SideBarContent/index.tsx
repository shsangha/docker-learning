import React from "react";
import { createPortal } from "react-dom";
import { TransitionStatus } from "react-transition-group/Transition";

interface Props {
  closeSideBar: () => void;
  transitionStatus: TransitionStatus;
  children: ({  }: {}) => React.ReactNode;
}

const SidebarContent: React.FunctionComponent<Props> = props => {
  const { closeSideBar, children, transitionStatus } = props;

  return createPortal(
    children({ closeSideBar, transitionStatus }),
    document.body
  );
};

export default SidebarContent;
