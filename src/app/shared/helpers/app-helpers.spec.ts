import { removeParenthesis } from './app-helpers';

describe('app-helpers', () => {
  it('should remove parenthesis from a string', () => {
    const input = 'test(123)';
    const expected = 'test123';
    expect(removeParenthesis(input)).toEqual(expected);
  });
});