import React, { Component } from "react";

interface Props {
  close: () => void;
  className: string;
}

export default class Overlay extends Component<Props, {}> {
  componentDidMount() {
    window.addEventListener("keydown", this.closeWithEsc);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.closeWithEsc);
  }

  public closeWithEsc = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      this.props.close();
    }
  };

  render() {
    const { close, className } = this.props;
    return <div role="presentation" onClick={close} className={className} />;
  }
}
