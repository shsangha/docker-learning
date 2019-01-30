import React, { Component } from 'react';
import SideBarContent from './SideBarContent';
import { CSSTransition } from 'react-transition-group';
const SideBarContext = React.createContext();
//open ? <SideBarContent {...props} closeSideBar={closeSideBar} /> : null
export default class SideBar extends Component {
  static OpenTrigger = ({ children }) => (
    <SideBarContext.Consumer>
      {({ open, openSideBar }) => (open ? null : children({ openSideBar }))}
    </SideBarContext.Consumer>
  );
  static CloseTrigger = ({ children }) => (
    <SideBarContext.Consumer>
      {({ open, closeSideBar }) => (open ? children(closeSideBar) : null)}
    </SideBarContext.Consumer>
  );

  static Content = props => (
    <SideBarContext.Consumer>
      {({ open, closeSideBar }) => (
        <CSSTransition
          timeout={{
            enter: props.enterTimeout || 300,
            exit: props.exitTimeout || 300
          }}
          classNames="sidebar"
          unmountOnExit
          in={open}
        >
          {status => (
            <SideBarContent {...props} transitionStatus={status} closeSideBar={closeSideBar} />
          )}
        </CSSTransition>
      )}
    </SideBarContext.Consumer>
  );

  state = {
    open: false
  };

  openSideBar = () => {
    this.setState({
      open: true
    });
  };
  closeSideBar = () => {
    this.setState({
      open: false
    });
  };
  render() {
    return (
      <SideBarContext.Provider
        value={{
          open: this.state.open,
          openSideBar: this.openSideBar,
          closeSideBar: this.closeSideBar
        }}
      >
        {this.props.children}
      </SideBarContext.Provider>
    );
  }
}
