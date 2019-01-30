import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import OverLay from '../../OverLay';

export default class ModalContent extends Component {
  exitButtonRef = React.createRef();
  lastTabbableRef = React.createRef();

  constructor(props) {
    super(props);
  }

  render() {
    const { closeModal, children, transitionStatus } = this.props;
    //  console.log(transitionStatus);

    return createPortal(
      <Fragment>
        {children({ closeModal, transitionStatus })}
        <OverLay transitionStatus={transitionStatus} onClick={closeModal} />
      </Fragment>,

      document.body
    );
  }
}
