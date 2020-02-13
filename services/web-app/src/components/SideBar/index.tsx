import React, { Component } from "react";
import SideBarContent from "./SideBarContent";
import { Transition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";

interface SideBarContext {
  open: boolean;
  closeSideBar: () => void;
  toggleSideBar: () => void;
  openSideBar: () => void;
}

const SideBarContext = React.createContext({} as SideBarContext);

interface ContentProps {
  enterTimeout?: number;
  exitTimeout?: number;
  children: ({

  }: {
    transitionStatus: TransitionStatus;
    closeSideBar: () => void;
  }) => React.ReactNode;
}

interface ToggleTriggerProps {
  children: ({

  }: {
    toggleSideBar: () => void;
    open: boolean;
  }) => React.ReactNode;
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

  public toggleSideBar = () => {
    this.setState(prevState => ({
      open: !prevState.open
    }));
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
          closeSideBar: this.closeSideBar,
          toggleSideBar: this.toggleSideBar,
          openSideBar: this.openSideBar
        }}
      >
        {this.props.children}
      </SideBarContext.Provider>
    );
  }

  public static ToggleTrigger: React.FunctionComponent<ToggleTriggerProps> = ({
    children
  }) => (
    <SideBarContext.Consumer>
      {({ toggleSideBar, open }) => children({ toggleSideBar, open })}
    </SideBarContext.Consumer>
  );

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
        <Transition
          timeout={{
            enter: props.enterTimeout || 300,
            exit: props.exitTimeout || 300
          }}
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
        </Transition>
      )}
    </SideBarContext.Consumer>
  );
}
