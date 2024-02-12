import { describe, test, expect } from 'vitest';
import { getMidiOfPitch } from '../src/music_new/functions';
import { KeyScaleMidiMap, KeySignatures, PitchClass, ScaleDegrees } from '../src/music_new/models';

describe('getMidiOfPitch', () => {
    test('roots of all keys', () => {
        expect(getMidiOfPitch('C', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(60);
        expect(getMidiOfPitch('G', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(67);
        expect(getMidiOfPitch('D', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(62);
        expect(getMidiOfPitch('A', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(69);
        expect(getMidiOfPitch('E', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(64);
        expect(getMidiOfPitch('B', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(71);
        expect(getMidiOfPitch('F#', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(66);
        expect(getMidiOfPitch('C#', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(61);
        expect(getMidiOfPitch('F', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(65);
        expect(getMidiOfPitch('Bb', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(70);
        expect(getMidiOfPitch('Eb', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(63);
        expect(getMidiOfPitch('Ab', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(68);
        expect(getMidiOfPitch('Db', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(61);
        expect(getMidiOfPitch('Gb', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(66);
        expect(getMidiOfPitch('Cb', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(71);
        expect(getMidiOfPitch('Am', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(69);
        expect(getMidiOfPitch('Em', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(64);
        expect(getMidiOfPitch('Bm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(71);
        expect(getMidiOfPitch('F#m', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(66);
        expect(getMidiOfPitch('C#m', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(61);
        expect(getMidiOfPitch('G#m', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(68);
        expect(getMidiOfPitch('D#m', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(63);
        expect(getMidiOfPitch('A#m', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(70);
        expect(getMidiOfPitch('Dm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(62);
        expect(getMidiOfPitch('Gm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(67);
        expect(getMidiOfPitch('Cm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(60);
        expect(getMidiOfPitch('Fm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(65);
        expect(getMidiOfPitch('Bbm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(70);
        expect(getMidiOfPitch('Ebm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(63);
        expect(getMidiOfPitch('Abm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(68);
    });
});

describe('Cm testing', () => {
    test('register 3 degree 6', () => expect(getMidiOfPitch('Cm', { scaleDegree: 6, register: 3, accidental: 0 })).toBe(56));
    test('register 3 degree 7', () => expect(getMidiOfPitch('Cm', { scaleDegree: 7, register: 3, accidental: 0 })).toBe(58));
    test('register 4 degree 1', () => expect(getMidiOfPitch('Cm', { scaleDegree: 1, register: 4, accidental: 0 })).toBe(60));
    test('register 4 degree 2', () => expect(getMidiOfPitch('Cm', { scaleDegree: 2, register: 4, accidental: 0 })).toBe(62));
});

describe('key scale midi maps', () => {
    KeySignatures.forEach(keySignature => {
        const scaleMidiMap = KeyScaleMidiMap.get(keySignature);
        test(`${keySignature} key scale midi map is valid`, () => {
            expect(scaleMidiMap).toBeDefined();
            if (scaleMidiMap === undefined) return;
            const pitchClassesFound = new Set<PitchClass>();
            ScaleDegrees.forEach(degree => {
                const mapping = scaleMidiMap.get(degree);
                expect(mapping).toBeDefined();
                if (mapping === undefined) return;
                pitchClassesFound.add(mapping.pitchClass);
            });
            expect(pitchClassesFound.size).toBe(ScaleDegrees.length);
        });
    });
});
