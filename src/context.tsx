import * as React from 'react';
import { getViewPortHeight, getViewPortWidth } from './screenSizeUtil';

export interface ScreenSizeContext {
  minScreenWidth?: number;
  maxScreenWidth?: number;
  minScreenHeight?: number;
  maxScreenHeight?: number;
  screenWidth: number | null;
  screenHeight: number | null;
}

const context = React.createContext<ScreenSizeContext>({
  screenWidth: getViewPortWidth(),
  screenHeight: getViewPortHeight(),
});

export const ScreenSizeProvider = context.Provider;

export const ScreenSizeConsumer = context.Consumer;
