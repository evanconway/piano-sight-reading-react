import { describe, test, expect } from 'vitest';
import { getMidiOfPitch } from '../src/music_new/functions';

describe('random music generation', () => {
    test('getMidiOfPitch', () => {
        expect(getMidiOfPitch('C', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(60);
    });
});
