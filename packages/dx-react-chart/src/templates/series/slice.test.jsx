import * as React from 'react';
import { shallow } from 'enzyme';
import { withStates } from '../../utils/with-states';
import { withPattern } from '../../utils/with-pattern';
import { Slice } from './slice';

jest.mock('@devexpress/dx-chart-core', () => ({
  getPieAnimationStyle: 'test-animation-style',
  HOVERED: 'test_hovered',
  SELECTED: 'test_selected',
}));

jest.mock('../../utils/with-states', () => ({
  withStates: jest.fn().mockReturnValue(x => x),
}));
jest.mock('../../utils/with-pattern', () => ({
  withPattern: jest.fn().mockReturnValue(x => x),
}));

describe('Slice', () => {
  const defaultProps = {
    argument: 'arg',
    value: 15,
    seriesIndex: 1,
    index: 2,
    x: 1,
    y: 2,
    d: 'M11 11',
    innerRadius: 10,
    outerRadius: 20,
    startAngle: 11,
    endAngle: 12,
    color: 'color',
    style: { tag: 'test-style' },
    scales: { tag: 'test-scales' },
    getAnimatedStyle: jest.fn().mockReturnValue('animated-style'),
  };

  it('should render slice', () => {
    const tree = shallow((
      <Slice {...defaultProps} />
    ));

    expect(tree.find('g').props().transform).toEqual('translate(1 2)');
    expect(tree.find('path').props()).toEqual({
      d: 'M11 11',
      fill: 'color',
      stroke: 'none',
      style: 'animated-style',
    });
  });

  it('should pass rest properties', () => {
    const tree = shallow((
      <Slice {...defaultProps} custom={10} />
    ));
    const { custom } = tree.find('path').props();

    expect(custom).toEqual(10);
  });

  it('should have hovered and selected states', () => {
    expect(withStates).toBeCalledWith({
      test_hovered: Slice,
      test_selected: Slice,
    });
  });

  it('should use patterns', () => {
    expect(withPattern.mock.calls).toEqual([
      [expect.any(Function), { opacity: 0.75 }],
      [expect.any(Function), { opacity: 0.5 }],
    ]);
    expect(withPattern.mock.calls[0][0]({ seriesIndex: 1, index: 2 }))
      .toEqual('series-1-point-2-hover');
    expect(withPattern.mock.calls[1][0]({ seriesIndex: 2, index: 3 }))
      .toEqual('series-2-point-3-selection');
  });
});
