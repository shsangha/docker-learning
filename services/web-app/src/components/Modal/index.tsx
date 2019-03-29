import React, { Component } from "react";
import ModalContent from "./ModalContent";
import { CSSTransition } from "react-transition-group";

const contextDefaults: {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
} = {
  open: false,
  openModal: () => {
    return null;
  },
  closeModal: () => {
    return null;
  }
};

const ModalContext = React.createContext(contextDefaults);

interface ContentProps {
  enterTimeout?: number;
  exitTimeout?: number;
  children: ({  }: {}) => React.ReactNode;
}

interface TriggerProps {
  children: ({  }: { openModal: () => void }) => React.ReactNode;
}

export default class Modal extends Component<{}, { open: boolean }> {
  public state = {
    open: false
  };

  public openModal = () => {
    this.setState({
      open: true
    });
  };
  public closeModal = () => {
    this.setState({
      open: false
    });
  };
  public render() {
    return (
      <ModalContext.Provider
        value={{
          open: this.state.open,
          openModal: this.openModal,
          closeModal: this.closeModal
        }}
      >
        {this.props.children}
      </ModalContext.Provider>
    );
  }

  public static Content: React.FunctionComponent<ContentProps> = props => (
    <ModalContext.Consumer>
      {({ open, closeModal }) => (
        <CSSTransition
          timeout={{
            enter: props.enterTimeout || 400,
            exit: props.exitTimeout || 400
          }}
          classNames="modal"
          unmountOnExit={true}
          in={open}
        >
          {status => (
            <ModalContent
              {...props}
              transitionStatus={status}
              closeModal={closeModal}
            />
          )}
        </CSSTransition>
      )}
    </ModalContext.Consumer>
  );
  public static Trigger: React.FunctionComponent<TriggerProps> = ({
    children
  }) => (
    <ModalContext.Consumer>
      {({ openModal }) => children({ openModal })}
    </ModalContext.Consumer>
  );
}
