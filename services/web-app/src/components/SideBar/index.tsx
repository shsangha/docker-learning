import React, { Component } from "react";
import SideBarContent from "./SideBarContent";
import { CSSTransition } from "react-transition-group";

const contextDefaults: {
  open: boolean;
  openSideBar: () => void;
  closeSideBar: () => void;
} = {
  open: false,
  openSideBar: () => {
    return null;
  },
  closeSideBar: () => {
    return null;
  }
};

const SideBarContext = React.createContext(contextDefaults);

interface ContentProps {
  enterTimeout?: number;
  exitTimeout?: number;
  children: ({  }: {}) => React.ReactNode;
}

interface OpenTriggerProps {
  children: ({  }: { openSideBar: () => void }) => React.ReactNode;
}

interface CloseTriggerProps {
  children: ({  }: { closeSideBar: () => void }) => React.ReactNode;
}

export default class SideBar extends Component<{}, { open: boolean }> {
  public state = {
    open: false
  };

  public openSideBar = () => {
    this.setState({
      open: true
    });
  };
  public closeSideBar = () => {
    this.setState({
      open: false
    });
  };
  public render() {
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
  public static OpenTrigger: React.FunctionComponent<OpenTriggerProps> = ({
    children
  }) => (
    <SideBarContext.Consumer>
      {({ open, openSideBar }) => (open ? null : children({ openSideBar }))}
    </SideBarContext.Consumer>
  );
  public static CloseTrigger: React.FunctionComponent<CloseTriggerProps> = ({
    children
  }) => (
    <SideBarContext.Consumer>
      {({ open, closeSideBar }) => (open ? children({ closeSideBar }) : null)}
    </SideBarContext.Consumer>
  );

  public static Content: React.FunctionComponent<ContentProps> = props => (
    <SideBarContext.Consumer>
      {({ open, closeSideBar }) => (
        <CSSTransition
          timeout={{
            enter: props.enterTimeout || 300,
            exit: props.exitTimeout || 300
          }}
          classNames="sidebar"
          unmountOnExit={true}
          in={open}
        >
          {status => (
            <SideBarContent
              {...props}
              transitionStatus={status}
              closeSideBar={closeSideBar}
            />
          )}
        </CSSTransition>
      )}
    </SideBarContext.Consumer>
  );
}
