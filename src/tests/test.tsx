import * as React from 'react';
import ReactDOM from 'react-dom';
import ScaledPropsProvider from '../ScaledPropsProvider';
import { withScaledProps, WithScaledPropsProps } from '../withScaledProps';

const ExampleComponent = (props: WithScaledPropsProps<{ fontSize: number }>) => {
  return <div style={{ fontSize: props.scaledProps.fontSize }} />;
};

const ExampleComponentWithScaledProps = withScaledProps({
  fontSize: { minValue: 1, maxValue: 10 },
})(ExampleComponent);

describe('Components', () => {
  it('render without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ScaledPropsProvider minScreenWidth={100} maxScreenWidth={1000}>
        <ExampleComponentWithScaledProps />
      </ScaledPropsProvider>,
      div,
    );
  });
});
