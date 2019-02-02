# 📏 react-scaled-props

> Props that scale based on window-size

[![NPM](https://img.shields.io/npm/v/react-scaled-props.svg)](https://www.npmjs.com/package/react-scaled-props) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-scaled-props
```

## Motivation

Many responsive-styling solutions work based on breakpoints. That is, once the screen reaches a certain size, styles change. This works pretty well, but _can_ lead to awkward edge-cases e.g. when the screen size is very close to a breakpoint, but not quite there, and your text is just a little too big or too small.

Adding more breakpoints could solve the issue, but that adds additional complexity. `react-scaled-props` seeks to solve the issue by providing a smooth gradient of values for all of the screen sizes _between_ your breakpoints. It takes your numeric properties like `fontSize`, `height`, `width`, etc. and calculates their value based on how close you are to your largest supported window-size vs your smallest. That way, your property values are tailored to the user's exact screen size, rather than bucketing them into breakpoint-based screen classes.

## Usage

### Scaled Props

The simplest Scaled Prop is just an object with the properties `minValue`, `maxValue`. The value that your component sees will be between those two bounds. When your screen is at or above your maximum supported width, the Scaled Prop will reach its max value, when your screen is at or below it's minimum supported width, the Scaled Prop will reach its min value.

ScaledProps can also track the height of the screen rather than the width. See the API section.

### Provider

Near the root of the app, add the `ScaledPropsProvider` component. This watches the screen size and provides context to any components in the tree that use scaled props. Any scaled prop will reach its maximum value when the screen width is >= `maxScreenWidth` and will reach its minimumValue when the screen width is <= `minScreenWidth`. For scaling based on height, add `minScreenHeight` and `maxScreenHeight`.

```jsx
import * as React from "react";
import { ScaledPropsProvider } from "react-scaled-props";

class App extends React.Component {
  render() {
    return (
      <ScaledPropsProvider minScreenWidth={400} maxScreenWidth={1200}>
        <MyComponent />
      </ScaledPropsProvider>
    );
  }
}
```

### High-Order Component

Anywhere under the `ScaledPropsProvider`, use the `withScaledProps` HOC.

```jsx
import * as React from "react";
import { withScaledProps } from "react-scaled-props";

const MySubComponent = props => {
  const { scaledProps } = props;
  const { fontSize, opacity } = scaledProps;

  return (
    <div>
      <p style={{ fontSize }}>
        This text will grow and shrink as the screen<strong>width</strong>
        changes!
      </p>
      <p style={{ opacity }}>
        This text will appear and disappear as the screen<strong>height</strong>
        changes!
      </p>
    </div>
  );
};

export default withScaledProps({
  fontSize: {
    min: 20,
    max: 40
  },
  opacity: {
    min: 0.1,
    max: 1,
    scaledBy: "height"
  }
})(MySubComponent);
```

### Typescript

```tsx
import * as React from "react";
import { WithScaledPropsProps } from "react-scaled-props";

// create an interface for the specific props that will be passed to `withScaledProps`
// this can have whichever keys you'd like, but all of the values must be type: number
interface ScaledProps {
  fontSize: number;
  opacity: number;
}

// create an interface for any other props that the component uses
interface OwnProps {
  someOtherProp: string;
}

// Intersect the "OwnProps" with the WithScaledPropsProps
type Props = OwnProps & WithScaledPropsProps<ScaledProps>;

class MySubComponent<Props> {
  ...
}
```

## API

### ScaledPropsProvider

| Name            | Type                             | Required | Default    | Description                                                                                                                                                  |
| --------------- | -------------------------------- | -------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| minScreenWidth  | number                           | No       | undefined  | The screen width where your width-scaled props will reach their minimum value                                                                                |
| maxScreenWidth  | number                           | No       | undefined  | The screen width where your width-scaled props will reach their maximim value                                                                                |
| minScreenHeight | number                           | No       | undefined  | The screen height where your height-scaled props will reach their minimum value                                                                              |
| maxScreenHeight | number                           | No       | undefined  | The screen height where your height-scaled props will reach their maximim value                                                                              |
| refreshBehavior | "onResize" or "onResizeComplete" | No       | "onResize" | Whether the props should update continuously while resizing (throttled-behavior) or update once the resize is completed (debounced-behavior)                 |
| refreshRate     | number                           | No       | 200        | How long to wait between refreshes if behavior is "onResize", or how long to wait after the user stops resizing to refresh if behavior is "onResizeComplete" |

### withScaledProps

`withScaledProps` accepts an object where each value is another object with the following properties:

| Name                  | Type                | Required | Default   | Description                                                                                                                                            |
| --------------------- | ------------------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| minValue              | number              | Yes      | -         | The value when the screen is <= your minScreenSize                                                                                                     |
| maxValue              | number              | Yes      | -         | The value when the screen is >= your maxScreenSize                                                                                                     |
| scaledBy              | "width" or "height" | No       | "width"   | Whether the prop should scale with the window height or width                                                                                          |
| minScreenSizeOverride | number              | No       | undefined | Specify if this prop should have a different minScreenSize than the rest of the app. This will be treated as width/height based on the `scaledBy` prop |
| maxScreenSizeOverride | number              | No       | undefined | Specify if this prop should have a different maxScreenSize than the rest of the app. This will be treated as width/height based on the `scaledBy` prop |

## License

MIT © [tripphamm](https://github.com/tripphamm)
