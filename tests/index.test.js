const {isNumber} = require('../src/index');

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
