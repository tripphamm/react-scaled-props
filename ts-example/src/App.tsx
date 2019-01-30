import * as React from "react";

import {
  ScaledPropsProvider,
  withScaledProps,
  WithScaledPropsProps
} from "react-scaled-props";

interface ExampleComponentScaledProps {
  fontSize: number;
  opacity: number;
}

type ExampleComponentProps = WithScaledPropsProps<
  ExampleComponentScaledProps
> & { text: string };

function ExampleComponent(props: ExampleComponentProps) {
  const { scaledProps } = props;

  const { fontSize, opacity } = scaledProps;

  return (
    <div>
      <div style={{ fontSize }}>
        This text will shrink and grow with the screen <strong>width</strong>
      </div>
      <div>fontSize: {fontSize}</div>
      <br />
      <div style={{ opacity }}>
        This text will fade in and out with the screen <strong>height</strong>
      </div>
      <div>opacity: {opacity}</div>
    </div>
  );
}

const WithScaledPropsExampleComponent = withScaledProps({
  fontSize: {
    minValue: 20,
    maxValue: 40
  },
  opacity: {
    minValue: 0.1,
    maxValue: 1,
    scaledBy: "height"
  }
})(ExampleComponent);

export default class App extends React.Component {
  render() {
    return (
      <ScaledPropsProvider
        minScreenWidth={400}
        maxScreenWidth={1200}
        minScreenHeight={400}
        maxScreenHeight={700}
      >
        <WithScaledPropsExampleComponent text="foo" />
      </ScaledPropsProvider>
    );
  }
}
