import {isNumber, formatTimeItem, validateTimeAndCursor} from '../src/index';

describe('#isNumber()', () => {
  test('should return true for numbers', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(1)).toBe(true);
    expect(isNumber('0')).toBe(true);
    expect(isNumber('1')).toBe(true);
  });

  test('should return false for not numbers', () => {
    expect(isNumber('')).toBe(false);
    expect(isNumber('a')).toBe(false);
    expect(isNumber(' 1')).toBe(false);
  });
});

describe('#formatTimeItem()', () => {
  test('should return default value if string is empty', () => {
    expect(formatTimeItem()).toBe('00');
  });

  test('should return formated value', () => {
    expect(formatTimeItem('1')).toBe('10');
    expect(formatTimeItem('11')).toBe('11');
    expect(formatTimeItem('111')).toBe('11');
    expect(formatTimeItem(2)).toBe('20');
  });
});

describe('#validateTimeAndCursor()', () => {
  const DF = '00:00:00';

  test('should return an array', () => {
    const res = validateTimeAndCursor(true, '', DF, ':', 0);
    expect(res).toBeInstanceOf(Array);
    expect(res).toHaveLength(2);
    expect(res).toEqual([DF, 0]);
  });

  test('should handle "showSeconds" option', () => {
    expect(validateTimeAndCursor(true, '12:34:56', DF)[0]).toEqual('12:34:56');
    expect(validateTimeAndCursor(true, '12:34', DF)[0]).toEqual('12:34:00');
    expect(validateTimeAndCursor(false, '12:34:56', DF)[0]).toEqual('12:34');
    expect(validateTimeAndCursor(false, '12:34', DF)[0]).toEqual('12:34');
  });

  test('should handle "colon" option', () => {
    expect(validateTimeAndCursor(true, '12-34-56', DF, '-')[0]).toEqual('12-34-56');
    expect(validateTimeAndCursor(true, '12-34', DF, '-')[0]).toEqual('12-34-00');
    expect(validateTimeAndCursor(false, '12-34-56', DF, '-')[0]).toEqual('12-34');
    expect(validateTimeAndCursor(false, '12-34', DF, '-')[0]).toEqual('12-34');
  });

  test('should return default value if bad format of hours', () => {
    expect(validateTimeAndCursor(false, '30:00', DF)[0]).toEqual('00:00');
    expect(validateTimeAndCursor(false, ':', DF)[0]).toEqual('00:00');

    expect(validateTimeAndCursor(true, '30:00', DF)[0]).toEqual('00:00:00');
    expect(validateTimeAndCursor(true, ':', DF)[0]).toEqual('00:00:00');
  });

  test('should validate hours', () => {
    expect(validateTimeAndCursor(false, '00:00', DF)[0]).toEqual('00:00');
    expect(validateTimeAndCursor(false, '12:00', DF)[0]).toEqual('12:00');
    expect(validateTimeAndCursor(false, '23:00', DF)[0]).toEqual('23:00');
    expect(validateTimeAndCursor(false, '24:00', DF)[0]).toEqual('23:00');
    expect(validateTimeAndCursor(false, '1:00', DF)[0]).toEqual('10:00');
    expect(validateTimeAndCursor(false, '24:00', '21:00')[0]).toEqual('21:00');
  });

  test('should validate minutes', () => {
    expect(validateTimeAndCursor(false, '12:00', DF)[0]).toEqual('12:00');
    expect(validateTimeAndCursor(false, '12:30', DF)[0]).toEqual('12:30');
    expect(validateTimeAndCursor(false, '12:59', DF)[0]).toEqual('12:59');
    expect(validateTimeAndCursor(false, '12:60', DF)[0]).toEqual('12:00');
    expect(validateTimeAndCursor(false, '12:1', DF)[0]).toEqual('12:10');
  });

  test('should validate seconds', () => {
    expect(validateTimeAndCursor(true, '12:00:00', DF)[0]).toEqual('12:00:00');
    expect(validateTimeAndCursor(true, '12:00:30', DF)[0]).toEqual('12:00:30');
    expect(validateTimeAndCursor(true, '12:00:59', DF)[0]).toEqual('12:00:59');
    expect(validateTimeAndCursor(true, '12:00:60', DF)[0]).toEqual('12:00:00');
    expect(validateTimeAndCursor(true, '12:00:1', DF)[0]).toEqual('12:00:10');
  });
});
