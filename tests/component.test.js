import React from 'react';
import {shallow} from 'enzyme';
import TimeField from '../src/index';

describe('Component', () => {
  let c;

  beforeEach(() => {
    c = shallow(<TimeField value={'00:00'} />);
  });

  afterEach(() => {
    c = null;
  });

  test('should render input field', () => {
    expect(c.find('input')).toHaveLength(1);
  });

  test('should render time value from props', () => {
    expect(c.node.props.value).toEqual('00:00');
  });
});
