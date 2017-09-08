import React from 'react';
import {shallow} from 'enzyme';
import TimeField from '../src/index';

describe('Component', () => {
  let a;
  let b;
  let persist;
  let onChangeA;
  let onChangeB;

  beforeEach(() => {
    persist = jest.fn();
    onChangeA = jest.fn();
    onChangeB = jest.fn();
    a = shallow(<TimeField value={'00:00'} onChange={onChangeA} />);
    b = shallow(<TimeField value={'00:00:00'} onChange={onChangeB} showSeconds />);
  });

  afterEach(() => {
    a = null;
    b = null;
  });

  test('should render input field', () => {
    expect(a.find('input')).toHaveLength(1);
    expect(b.find('input')).toHaveLength(1);
  });

  test('should render time value from props', () => {
    expect(a.find('input').node.props.value).toEqual('00:00');
    expect(b.find('input').node.props.value).toEqual('00:00:00');
  });

  test('should render reserved props', () => {
    expect(a.setProps({value: '12:34'}).find('input').node.props.value).toEqual('12:34');
    expect(b.setProps({value: '12:34:56'}).find('input').node.props.value).toEqual('12:34:56');
  });

  test('should keep old values w/o changes', () => {
    expect(a.setProps({value: '00:00'}).find('input').node.props.value).toEqual('00:00');
    expect(b.setProps({value: '00:00:00'}).find('input').node.props.value).toEqual('00:00:00');
  });

  test('should validate reserved props before render', () => {
    expect(a.setProps({value: '30:60'}).find('input').node.props.value).toEqual('00:00');
    expect(b.setProps({value: '30:60:90'}).find('input').node.props.value).toEqual('00:00:00');
  });

  test('should validate value after input change', () => {
    const eventA = {target: {value: '12:34'}, persist};
    expect(a.simulate('change', eventA).find('input').node.props.value).toEqual('12:34');

    const eventB = {target: {value: '12:34:56'}, persist};
    expect(b.simulate('change', eventB).find('input').node.props.value).toEqual('12:34:56');
  });
});
