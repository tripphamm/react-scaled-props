import * as React from "react";
import { ScreenSizeProvider } from "./context";
import throttle from "lodash.throttle";
import debounce from "lodash.debounce";
import { Cancelable } from "lodash";

import { getViewPortHeight, getViewPortWidth } from "./screenSizeUtil";

type RefreshBehavior = "onResizeComplete" | "onResize";

interface ScaledPropsProviderState {
  screenWidth: number | null;
  screenHeight: number | null;
}

interface ScaledPropsProviderProps {
  minScreenWidth?: number;
  maxScreenWidth?: number;
  minScreenHeight?: number;
  maxScreenHeight?: number;
  refreshBehavior?: RefreshBehavior;
  refreshRate?: number;
}

const defaultThrottlingRefreshRate = 200;
const defaultDebouncingRefreshRate = 200;

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

    const { refreshBehavior = "onResize", refreshRate } = this.props;

    if (refreshBehavior === "onResize") {
      const throttleWait =
        refreshRate !== undefined ? refreshRate : defaultThrottlingRefreshRate;

      this.resizeEventListener = throttle(this.setScreenSize, throttleWait);
    } else if (refreshBehavior === "onResizeComplete") {
      const debounceWait =
        refreshRate !== undefined ? refreshRate : defaultDebouncingRefreshRate;

      this.resizeEventListener = debounce(this.setScreenSize, debounceWait);
    }
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
