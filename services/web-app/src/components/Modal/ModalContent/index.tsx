import React from "react";
import { createPortal } from "react-dom";
import { TransitionStatus } from "react-transition-group/Transition";

interface Props {
  transitionStatus: TransitionStatus;
  closeModal: () => void;
  children: ({  }: {}) => React.ReactNode;
}

const ModalContent: React.FunctionComponent<Props> = props => {
  const { closeModal, children, transitionStatus } = props;
  return createPortal(
    children({ closeModal, transitionStatus }),
    document.body
  );
};

export default ModalContent;
