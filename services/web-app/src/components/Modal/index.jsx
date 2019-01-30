import React, { Component } from 'react';
import ModalContent from './ModalContent';
import { CSSTransition } from 'react-transition-group';

const ModalContext = React.createContext();

export default class Modal extends Component {
  static Content = props => (
    <ModalContext.Consumer>
      {({ open, closeModal }) => (
        <CSSTransition
          timeout={{
            enter: props.enterTimeout || 400,
            exit: props.exitTimeout || 400
          }}
          classNames="modal"
          unmountOnExit
          in={open}
        >
          {status => <ModalContent {...props} transitionStatus={status} closeModal={closeModal} />}
        </CSSTransition>
      )}
    </ModalContext.Consumer>
  );
  static Trigger = ({ children }) => (
    <ModalContext.Consumer>{({ openModal }) => children({ openModal })}</ModalContext.Consumer>
  );

  state = {
    open: false
  };

  openModal = () => {
    this.setState({
      open: true
    });
  };
  closeModal = () => {
    this.setState({
      open: false
    });
  };
  render() {
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
}
