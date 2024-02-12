import { describe, test, expect } from 'vitest';
import { getMidiOfPitch } from '../src/music_new/functions';

describe('getMidiOfPitch', () => {
    // roots for all keys
    test('C', () => expect(getMidiOfPitch('C', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(60));
    test('G', () => expect(getMidiOfPitch('G', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(67));
    test('D', () => expect(getMidiOfPitch('D', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(62));
    test('A', () => expect(getMidiOfPitch('A', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(69));
    test('E', () => expect(getMidiOfPitch('E', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(64));
    test('B', () => expect(getMidiOfPitch('B', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(71));
    test('F#', () => expect(getMidiOfPitch('F#', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(66));
    test('C#', () => expect(getMidiOfPitch('C#', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(61));
    test('F', () => expect(getMidiOfPitch('F', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(65));
    test('Bb', () => expect(getMidiOfPitch('Bb', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(70));
    test('Eb', () => expect(getMidiOfPitch('Eb', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(63));
    test('Ab', () => expect(getMidiOfPitch('Ab', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(68));
    test('Db', () => expect(getMidiOfPitch('Db', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(61));
    test('Gb', () => expect(getMidiOfPitch('Gb', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(66));
    test('Cb', () => expect(getMidiOfPitch('Cb', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(71));
    test('Am', () => expect(getMidiOfPitch('Am', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(69));
    test('Em', () => expect(getMidiOfPitch('Em', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(64));
    test('Bm', () => expect(getMidiOfPitch('Bm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(71));
    test('F#m', () => expect(getMidiOfPitch('F#m', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(66));
    test('C#m', () => expect(getMidiOfPitch('C#m', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(61));
    test('G#m', () => expect(getMidiOfPitch('G#m', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(68));
    test('D#m', () => expect(getMidiOfPitch('D#m', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(63));
    test('A#m', () => expect(getMidiOfPitch('A#m', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(70));
    test('Dm', () => expect(getMidiOfPitch('Dm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(62));
    test('Gm', () => expect(getMidiOfPitch('Gm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(67));
    test('Cm', () => expect(getMidiOfPitch('Cm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(60));
    test('Fm', () => expect(getMidiOfPitch('Fm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(65));
    test('Bbm', () => expect(getMidiOfPitch('Bbm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(70));
    test('Ebm', () => expect(getMidiOfPitch('Ebm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(63));
    test('Abm', () => expect(getMidiOfPitch('Abm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(68));
});

describe('Cm testing', () => {
    test('register 3 degree 6', () => expect(getMidiOfPitch('Cm', { scaleDegree: 6, register: 3, accidental: 0 })).toBe(56));
    test('register 3 degree 7', () => expect(getMidiOfPitch('Cm', { scaleDegree: 7, register: 3, accidental: 0 })).toBe(58));
    test('register 4 degree 1', () => expect(getMidiOfPitch('Cm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(60));
    test('register 4 degree 2', () => expect(getMidiOfPitch('Cm', { scaleDegree: 2, register: 4, accidental: 0 })).toBe(62));
});
