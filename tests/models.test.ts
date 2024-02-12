import { describe, test, expect } from 'vitest';
import { KeyScaleMidiMap, KeySignatures, PitchClass, ScaleDegrees } from '../src/music/models';

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
