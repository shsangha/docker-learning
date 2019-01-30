import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import OverLay from '../../OverLay';

export default class SidebarContent extends Component {
  exitButtonRef = React.createRef();
  lastTabbableRef = React.createRef();

  constructor(props) {
    super(props);
  }

  render() {
    const { closeSideBar, children, transitionStatus } = this.props;
    console.log(transitionStatus);
    return createPortal(
      <Fragment>
        {children({ closeSideBar, transitionStatus })}
        <OverLay transitionStatus={transitionStatus} onClick={closeSideBar} />
      </Fragment>,

      document.body
    );
  }
}
