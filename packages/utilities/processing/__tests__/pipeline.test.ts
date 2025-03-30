/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { describe, it, expect } from 'vitest';
import { pipeline, toPipe } from '../pipeline';

describe('pipeline', () => {
  it('should transform data through a series of functions', () => {
    const data = 0;
    const increase = (x: number) => x + 1;

    const result = pipeline(data, increase, increase, increase);

    expect(result).toBe(3);
  });

  it('should handle different types of transformations', () => {
    const data = 'hello';
    const addExclamation = (str: string) => `${str}!`;
    const toUpperCase = (str: string) => str.toUpperCase();

    const result = pipeline(data, addExclamation, toUpperCase);

    expect(result).toBe('HELLO!');
  });

  it('should work with single transformation', () => {
    const data = 5;
    const double = (x: number) => x * 2;

    const result = pipeline(data, double);

    expect(result).toBe(10);
  });
});

describe('toPipe', () => {
  it('should allow piping with additional arguments', () => {
    const data = 0;
    const sum = (x: number, y: number) => x + y;

    const result = toPipe(data).to(sum, 1).to(sum, 2).to(sum, 3).value;

    expect(result).toBe(6);
  });

  it('should handle different types and transformations', () => {
    const data = 'hello';
    const append = (str: string, suffix: string) => str + suffix;
    const transform = (str: string, fn: (s: string) => string) => fn(str);

    const result = toPipe(data)
      .to(append, ' world')
      .to(transform, (s: string) => s.toUpperCase()).value;

    expect(result).toBe('HELLO WORLD');
  });

  it('should work with single transformation', () => {
    const data = [1, 2, 3];
    const addItem = (arr: number[], item: number) => [...arr, item];

    const result = toPipe(data).to(addItem, 4).value;

    expect(result).toEqual([1, 2, 3, 4]);
  });
});
