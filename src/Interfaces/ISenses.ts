export interface ISight {
  sight: string;
  distance: number;
}

export interface ISound {
  sound: string;
  volume: number;
}

export interface ISmell {
  scent: string;
  strength: number;
}

export interface ITaste {
  taste: string;
  strength: number;
}

export interface IFeeling {
  feeling: string;
  intensity: number;
}

export interface ISenses {
  see: Array<ISight>;
  hear: Array<ISound>;
  smell: Array<ISmell>;
  taste: Array<ITaste>;
  feel: Array<IFeeling>;
}
