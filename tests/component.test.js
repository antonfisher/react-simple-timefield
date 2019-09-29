import React from 'react';
import {shallow, mount} from 'enzyme';
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
    a = mount(<TimeField value={'12:34'} onChange={onChangeA} />);
    b = mount(<TimeField value={'12:34:56'} onChange={onChangeB} showSeconds />);
  });

  afterEach(() => {
    if (a) {
      a.unmount();
    }
    a = null;

    if (b) {
      b.unmount();
    }
    b = null;
  });

  test('should render input field', () => {
    expect(a.find('input')).toHaveLength(1);
    expect(b.find('input')).toHaveLength(1);
  });

  test('should render custom input field', () => {
    const customInput = shallow(<TimeField value={'12:34'} onChange={onChangeA} input={<input id="lol" />} />);

    expect(customInput.find('input')).toHaveLength(1);
    expect(customInput.find('input').getElement().props.id).toEqual('lol');
  });

  test('should render time value from props', () => {
    expect(a.find('input').getElement().props.value).toEqual('12:34');
    expect(b.find('input').getElement().props.value).toEqual('12:34:56');
  });

  test('should render reserved props', () => {
    expect(a.setProps({value: '21:43'}).state('value')).toEqual('21:43');
    expect(b.setProps({value: '21:43:13'}).state('value')).toEqual('21:43:13');
  });

  test('should keep old values w/o changes', () => {
    expect(a.setProps({value: '12:34'}).state('value')).toEqual('12:34');
    expect(b.setProps({value: '12:34:56'}).state('value')).toEqual('12:34:56');
  });

  test('should validate reserved props before render', () => {
    expect(a.setProps({value: '30:60'}).state('value')).toEqual('00:00');
    expect(b.setProps({value: '30:60:90'}).state('value')).toEqual('00:00:00');
  });

  test('should validate value after input change', () => {
    const eventA = {target: {value: '12:34'}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('12:34');

    const eventB = {target: {value: '12:34:56'}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:34:56');
  });

  test('should handle added number character', () => {
    const eventA = {target: {value: '212:34', selectionEnd: 1}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('22:34');

    const eventB = {target: {value: '12:34:156', selectionEnd: 7}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:34:16');
  });

  test('should handle added ":" character', () => {
    const eventA = {target: {value: '12::34', selectionEnd: 3}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('12:34');

    const eventB = {target: {value: '12:34::56', selectionEnd: 6}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:34:56');
  });

  test('should handle added number character before ":"', () => {
    const eventA = {target: {value: '121:34', selectionEnd: 3}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('12:14');

    const eventB = {target: {value: '12:341:56', selectionEnd: 6}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:34:16');
  });

  test('should handle added number character before ":" (update position)', () => {
    const eventA = {target: {value: '132:34', selectionEnd: 2}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('13:34');

    const eventB = {target: {value: '12:334:56', selectionEnd: 5}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:33:56');
  });

  test('should keep old value if position is out pf range', () => {
    const eventA = {target: {value: '12:341', selectionEnd: 6}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('12:34');

    const eventB = {target: {value: '12:34:561', selectionEnd: 9}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:34:56');
  });

  test('should keep old value if not a number was typed', () => {
    const eventA = {target: {value: 'a12:34', selectionEnd: 1}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('12:34');

    const eventB = {target: {value: '12:34:a56', selectionEnd: 7}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:34:56');
  });

  test('should handle removed character', () => {
    const eventA = {target: {value: '1:34', selectionEnd: 1}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('10:34');

    const eventB = {target: {value: '12:34:6', selectionEnd: 6}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:34:06');
  });

  test('should handle removed ":" character', () => {
    const eventA = {target: {value: '1234', selectionEnd: 2}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('10:34');

    const eventB = {target: {value: '12:3456', selectionEnd: 5}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:30:56');
  });

  test('should handle single character replacement', () => {
    const eventA = {target: {value: '12:44', selectionEnd: 4}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('12:44');

    const eventB = {target: {value: '12:34:46', selectionEnd: 7}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:34:46');
  });

  test('should handle single ":" character replacement', () => {
    const eventA = {target: {value: '12a34', selectionEnd: 3}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('12:34');

    const eventB = {target: {value: '12:34a56', selectionEnd: 6}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:34:56');
  });

  test('should handle more than 2 characters replacement (number)', () => {
    const eventA = {target: {value: '12:2', selectionEnd: 4}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('12:20');

    const eventB = {target: {value: '12:34:2', selectionEnd: 7}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:34:20');
  });

  test('should handle 2 characters replacement (invalid character)', () => {
    const eventA = {target: {value: '12:a', selectionEnd: 4}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('12:34');

    const eventB = {target: {value: '12:34:a', selectionEnd: 7}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:34:56');
  });

  test('should handle more than 2 characters replacement (invalid character)', () => {
    const eventA = {target: {value: '12a', selectionEnd: 3}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('12:34');

    const eventB = {target: {value: '12:34a', selectionEnd: 6}, persist};
    expect(b.simulate('change', eventB).state('value')).toEqual('12:34:56');
  });

  test('should handle all characters replacement (invalid character)', () => {
    const eventA = {target: {value: 'a', selectionEnd: 1}, persist};
    expect(a.simulate('change', eventA).state('value')).toEqual('12:34');
  });
});
