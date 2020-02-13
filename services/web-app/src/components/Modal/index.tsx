import React, { Component } from "react";
import ModalContent from "./ModalContent";
import { Transition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";

interface Context {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = React.createContext({} as Context);

interface ContentProps {
  enterTimeout?: number;
  exitTimeout?: number;
  children: ({

  }: {
    transitionStatus: TransitionStatus;
    closeModal: () => void;
  }) => React.ReactNode;
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

  public static Content: React.FunctionComponent<ContentProps> = (
    props: ContentProps
  ) => (
    <ModalContext.Consumer>
      {({ open, closeModal }) => (
        <Transition
          timeout={{
            enter: props.enterTimeout || 400,
            exit: props.exitTimeout || 400
          }}
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
        </Transition>
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
