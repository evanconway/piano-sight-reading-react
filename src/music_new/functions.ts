import { KeySignatureBase, NoteDuration, Pitch, TimeSignature } from "./models";

interface RandomMusicParams {
    numberOfMeasures?: number,
    timeSignature?: TimeSignature,
    keySignatureBase?: KeySignatureBase,
    minor?: boolean,
    topStaffDuration?: NoteDuration,
    topStaffHighestPitch?: Pitch,
    topStaffLowestPitch?: Pitch,
    topStaffNotesPerChord?: number,
    bottomStaffDuration?: NoteDuration,
    bottomStaffHighestPitch?: Pitch,
    bottomStaffLowestPitch?: Pitch,
    bottomStaffNotesPerChord?: number,
}

const generateRandomMusic = (params?: RandomMusicParams) => {
    // setup default values
    const numberOfMeasures = params?.numberOfMeasures !== undefined ? params.numberOfMeasures : 16;
    const timeSignature = params?.timeSignature ? params.timeSignature : "4/4";
    const keySignatureBase = params?.keySignatureBase ? params.keySignatureBase : "C";
    const minor = params?.minor !== undefined ? params.minor : false;
    const topStaffDuration = params?.topStaffDuration ? params.topStaffDuration : "quarter";
    const topStaffHighestPitch: Pitch = params?.topStaffHighestPitch ? params.topStaffHighestPitch : { scaleDegree: 1, register: 6 };
    const topStaffLowestPitch: Pitch = params?.topStaffLowestPitch ? params.topStaffLowestPitch : { scaleDegree: 1, register: 4 };
    const topStaffNotesPerChord = params?.topStaffNotesPerChord ? params.topStaffNotesPerChord : 2;
    const bottomStaffDuration = params?.bottomStaffDuration ? params.bottomStaffDuration : "quarter";
    const bottomStaffHighestPitch: Pitch = params?.bottomStaffHighestPitch ? params.bottomStaffHighestPitch : { scaleDegree: 1, register: 6 };
    const bottomStaffLowestPitch: Pitch = params?.bottomStaffLowestPitch ? params.bottomStaffLowestPitch : { scaleDegree: 1, register: 4 };
    const bottomStaffNotesPerChord = params?.bottomStaffNotesPerChord ? params.bottomStaffNotesPerChord : 2;

    
};
