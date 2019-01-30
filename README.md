# react-scaled-props

> Props that scale based on window-size

[![NPM](https://img.shields.io/npm/v/react-scaled-props.svg)](https://www.npmjs.com/package/react-scaled-props) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-scaled-props
```

## Usage

### Provider

Near the root of the app, add the `ScaledPropsProvider` component. This watches the screen size and provides context to any subcomponents that use scaled props. Any scaled prop will reach its maximum value when the screen width is >= `maxScreenWidth` and will reach its minimumValue when the screen width is <= `minScreenWidth`. For scaling based on height, add `minScreenHeight` and `maxScreenHeight`.

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
  const { fontSize } = scaledProps;

  return (
    <>
      <p style={{ fontSize }}>
        This text will grow and shrink with the window size!
      </p>
      <p style={{ opacity }}>
        This text will appear and disappear as the window size changes!
      </p>
    </>
  );
};

export default withScaledProps({
  fontSize: {
    min: 10,
    max: 22
  },
  opacity: {
    min: 0.1,
    max: 1
  }
})(MySubComponent);
```

### Typescript

```tsx
import * as React from "react";
import { ScaledProps } from "react-scaled-props";

// create an interface for the specific props that will be passed to `withScaledProps`
interface MySubComponentScaledProps {
  fontSize: number;
  opacity: number;
}

// create an interface for any other props that the component uses
interface MySubComponentOwnProps {
  someOtherProp: string;
}

// Intersect the "OwnProps" with the ScaledProps
type Props = MySubComponentOwnProps & ScaledProps<MySubComponentScaledProps>;

class MySubComponent<Props> {
  ...
}
```

## Provider

##

## License

MIT © [tripphamm](https://github.com/tripphamm)
