import * as React from 'react';

import { ScreenSizeConsumer } from './context';

/**
 * SetDifference (same as Exclude)
 * @desc Set difference of given union types `A` and `B`
 */
export type SetDifference<A, B> = A extends B ? never : A;

/**
 * SetComplement
 * @desc Set complement of given union types `A` and (it's subset) `A1`
 */
export type SetComplement<A, A1 extends A> = SetDifference<A, A1>;

/**
 * Subtract
 * @desc From `T` remove properties that exist in `T1` (`T1` is a subtype of `T`)
 */
export type Subtract<T extends T1, T1 extends object> = Pick<T, SetComplement<keyof T, keyof T1>>;

interface ScalableProp {
  minValue: number;
  maxValue: number;
  minScreenSizeOverride?: number;
  maxScreenSizeOverride?: number;
  scaledBy?: 'width' | 'height';
}

interface ScalableProps {
  [propName: string]: ScalableProp;
}

export interface WithScaledPropsProps<T> {
  scaledProps: { [P in keyof T]: number };
}

export const withScaledProps = <T extends ScalableProps>(scalableProps: T) => {
  return <AllProps extends WithScaledPropsProps<T>>(
    OriginalComponent: React.ComponentType<AllProps>,
  ) => {
    type InjectedProps = WithScaledPropsProps<T>;
    type NonInjectedProps = Subtract<AllProps, InjectedProps>;
    const WithScaledProps: React.FunctionComponent<NonInjectedProps> & {
      WrappedComponent?: React.ComponentType<AllProps>;
    } = (props: AllProps) => {
      return (
        <ScreenSizeConsumer>
          {screenSizeContext => {
            const {
              screenWidth,
              screenHeight,
              minScreenHeight,
              maxScreenHeight,
              minScreenWidth,
              maxScreenWidth,
            } = screenSizeContext;

            const scaledProps = Object.keys(scalableProps).reduce(
              (aggregator: { [P in keyof T]: number }, scalablePropName: keyof T) => {
                const scalableProp = scalableProps[scalablePropName];

                const {
                  minValue,
                  maxValue,
                  minScreenSizeOverride,
                  maxScreenSizeOverride,
                  scaledBy = 'width',
                } = scalableProp;

                if (minValue === undefined || maxValue === undefined) {
                  throw new Error(
                    `Scalable prop, ${scalablePropName}, must specify both a \`minValue\` and a \`maxValue\``,
                  );
                }

                if (minValue >= maxValue) {
                  throw new Error(
                    `Scalable prop, ${scalablePropName}, specified a \`minValue\` that was >= the specified \`maxValue\``,
                  );
                }

                let actualSize;
                let lowerBound;
                let upperBound;
                if (scaledBy === 'width') {
                  actualSize = screenWidth;
                  lowerBound =
                    minScreenSizeOverride !== undefined ? minScreenSizeOverride : minScreenWidth;
                  upperBound =
                    maxScreenSizeOverride !== undefined ? maxScreenSizeOverride : maxScreenWidth;

                  if (lowerBound === undefined || upperBound === undefined) {
                    throw new Error(
                      `Scalable prop, ${scalablePropName}, does not have valid bounds. Either specify a global \`minScreenWidth\` and \`maxScreenWidth\` on the ScalablePropsProvider, or specify a \`minScreenWidthOveride\` and \`maxScreenWidthOveride\` with the scalable prop definition.`,
                    );
                  }
                } else if (scaledBy === 'height') {
                  actualSize = screenHeight;
                  lowerBound =
                    minScreenSizeOverride !== undefined ? minScreenSizeOverride : minScreenHeight;
                  upperBound =
                    maxScreenSizeOverride !== undefined ? maxScreenSizeOverride : maxScreenHeight;

                  if (lowerBound === undefined || upperBound === undefined) {
                    throw new Error(
                      `Scalable prop, ${scalablePropName}, does not have valid bounds. Either specify a global \`minScreenHeight\` and \`maxScreenHeight\` on the ScalablePropsProvider, or specify a \`minScreenHeightOveride\` and \`maxScreenHeightOveride\` with the scalable prop definition.`,
                    );
                  }
                } else {
                  throw new Error(
                    `Scalable prop, ${scalablePropName}, specified \`scaledBy:\` ${scaledBy}. Valid values are "width" and "height". Default value is "width".`,
                  );
                }

                let value;
                if (actualSize === null) {
                  value = minValue;
                } else if (actualSize <= lowerBound) {
                  value = minValue;
                } else if (actualSize >= upperBound) {
                  value = maxValue;
                } else {
                  // screen size is between lowerBound and upperBound
                  const valueRange = maxValue - minValue;
                  const sizeRange = upperBound - lowerBound;
                  const sizePercentage = (actualSize - lowerBound) / sizeRange;

                  value = minValue + valueRange * sizePercentage;
                }

                return {
                  ...aggregator,
                  [scalablePropName as keyof T]: value,
                };
              },
              {},
            );

            return <OriginalComponent {...props} scaledProps={scaledProps} />;
          }}
        </ScreenSizeConsumer>
      );
    };

    WithScaledProps.displayName = `WithScaledProps(${OriginalComponent.displayName ||
      OriginalComponent.name ||
      'Component'})`;

    WithScaledProps.WrappedComponent = OriginalComponent;

    return WithScaledProps;
  };
};
