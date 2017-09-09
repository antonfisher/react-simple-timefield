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
    a = shallow(<TimeField value={'12:34'} onChange={onChangeA} />);
    b = shallow(<TimeField value={'12:34:56'} onChange={onChangeB} showSeconds />);
  });

  afterEach(() => {
    a = null;
    b = null;
  });

  test('should render input field', () => {
    expect(a.find('input')).toHaveLength(1);
    expect(b.find('input')).toHaveLength(1);
  });

  test('should render custom input field', () => {
    const customInput = shallow(<TimeField value={'12:34'} onChange={onChangeA} input={<input id="lol" />} />);

    expect(customInput.find('input')).toHaveLength(1);
    expect(customInput.find('input').node.props.id).toEqual('lol');
  });

  test('should render time value from props', () => {
    expect(a.find('input').node.props.value).toEqual('12:34');
    expect(b.find('input').node.props.value).toEqual('12:34:56');
  });

  test('should render reserved props', () => {
    expect(a.setProps({value: '21:43'}).find('input').node.props.value).toEqual('21:43');
    expect(b.setProps({value: '21:43:13'}).find('input').node.props.value).toEqual('21:43:13');
  });

  test('should keep old values w/o changes', () => {
    expect(a.setProps({value: '12:34'}).find('input').node.props.value).toEqual('12:34');
    expect(b.setProps({value: '12:34:56'}).find('input').node.props.value).toEqual('12:34:56');
  });

  test('should validate reserved props before render', () => {
    //TODO keep old values?
    expect(a.setProps({value: '30:60'}).find('input').node.props.value).toEqual('00:00');
    expect(b.setProps({value: '30:60:90'}).find('input').node.props.value).toEqual('00:00:00');
  });

  test('should validate value after input change', () => {
    const eventA = {target: {value: '12:34'}, persist};
    expect(a.simulate('change', eventA).find('input').node.props.value).toEqual('12:34');

    const eventB = {target: {value: '12:34:56'}, persist};
    expect(b.simulate('change', eventB).find('input').node.props.value).toEqual('12:34:56');
  });

  test('should handle added number character', () => {
    const eventA = {target: {value: '212:34', selectionEnd: 1}, persist};
    expect(a.simulate('change', eventA).find('input').node.props.value).toEqual('22:34');

    const eventB = {target: {value: '12:34:156', selectionEnd: 7}, persist};
    expect(b.simulate('change', eventB).find('input').node.props.value).toEqual('12:34:16');
  });

  test('should handle added ":" character', () => {
    const eventA = {target: {value: '12::34', selectionEnd: 3}, persist};
    expect(a.simulate('change', eventA).find('input').node.props.value).toEqual('12:34');

    const eventB = {target: {value: '12:34::56', selectionEnd: 6}, persist};
    expect(b.simulate('change', eventB).find('input').node.props.value).toEqual('12:34:56');
  });

  test('should handle added number character before ":"', () => {
    const eventA = {target: {value: '121:34', selectionEnd: 3}, persist};
    expect(a.simulate('change', eventA).find('input').node.props.value).toEqual('12:14');

    const eventB = {target: {value: '12:341:56', selectionEnd: 6}, persist};
    expect(b.simulate('change', eventB).find('input').node.props.value).toEqual('12:34:16');
  });

  test('should handle added number character before ":" (update position)', () => {
    const eventA = {target: {value: '132:34', selectionEnd: 2}, persist};
    expect(a.simulate('change', eventA).find('input').node.props.value).toEqual('13:34');

    const eventB = {target: {value: '12:334:56', selectionEnd: 5}, persist};
    expect(b.simulate('change', eventB).find('input').node.props.value).toEqual('12:33:56');
  });

  test('should keep old value if position is out pf range', () => {
    const eventA = {target: {value: '12:341', selectionEnd: 6}, persist};
    expect(a.simulate('change', eventA).find('input').node.props.value).toEqual('12:34');

    const eventB = {target: {value: '12:34:561', selectionEnd: 9}, persist};
    expect(b.simulate('change', eventB).find('input').node.props.value).toEqual('12:34:56');
  });

  test('should keep old value if not a number was typed', () => {
    const eventA = {target: {value: 'a12:34', selectionEnd: 1}, persist};
    expect(a.simulate('change', eventA).find('input').node.props.value).toEqual('12:34');

    const eventB = {target: {value: '12:34:a56', selectionEnd: 7}, persist};
    expect(b.simulate('change', eventB).find('input').node.props.value).toEqual('12:34:56');
  });

  test('should handle removed character', () => {
    const eventA = {target: {value: '1:34', selectionEnd: 1}, persist};
    expect(a.simulate('change', eventA).find('input').node.props.value).toEqual('10:34');

    const eventB = {target: {value: '12:34:6', selectionEnd: 6}, persist};
    expect(b.simulate('change', eventB).find('input').node.props.value).toEqual('12:34:06');
  });

  test('should handle removed ":" character', () => {
    const eventA = {target: {value: '1234', selectionEnd: 2}, persist};
    expect(a.simulate('change', eventA).find('input').node.props.value).toEqual('10:34');

    const eventB = {target: {value: '12:3456', selectionEnd: 5}, persist};
    expect(b.simulate('change', eventB).find('input').node.props.value).toEqual('12:30:56');
  });
});
