import * as React from "react";
import { ScreenSizeProvider } from "./context";
import throttle from "lodash.throttle";
import { Cancelable } from "lodash";

import { getViewPortHeight, getViewPortWidth } from "./screenSizeUtil";

interface ScaledPropsProviderState {
  screenWidth: number | null;
  screenHeight: number | null;
}

interface ScaledPropsProviderProps {
  minScreenWidth?: number;
  maxScreenWidth?: number;
  minScreenHeight?: number;
  maxScreenHeight?: number;
  refreshRate?: number;
}

const defaultRefreshRate = 200;

export default class ScaledPropsProvider extends React.Component<
  ScaledPropsProviderProps,
  ScaledPropsProviderState
> {
  private resizeEventListener: (() => void) & Cancelable;

  state: ScaledPropsProviderState = {
    screenWidth: null,
    screenHeight: null
  };

  constructor(props: ScaledPropsProviderProps) {
    super(props);

    this.setScreenSize = this.setScreenSize.bind(this);
  }

  componentDidMount() {
    this.setScreenSize();

    this.resizeEventListener = throttle(
      this.setScreenSize,
      this.props.refreshRate || defaultRefreshRate
    );
    window.addEventListener("resize", this.resizeEventListener);
  }

  componentWillUnmount() {
    this.resizeEventListener.cancel();
    window.removeEventListener("resize", this.resizeEventListener);
  }

  setScreenSize() {
    this.setState({
      screenWidth: getViewPortWidth(),
      screenHeight: getViewPortHeight()
    });
  }

  render() {
    const { screenWidth, screenHeight } = this.state;
    const {
      minScreenHeight,
      maxScreenHeight,
      minScreenWidth,
      maxScreenWidth,
      children
    } = this.props;

    const context = {
      minScreenHeight,
      maxScreenHeight,
      minScreenWidth,
      maxScreenWidth,
      screenWidth,
      screenHeight
    };

    return <ScreenSizeProvider value={context}>{children}</ScreenSizeProvider>;
  }
}
