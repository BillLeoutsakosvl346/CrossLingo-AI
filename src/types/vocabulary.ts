export interface LearnedWord {
  id: string;
  word: string;
  translation: string;
  context: string;
  dateAdded: Date;
  timesEncountered: number;
}

export interface TextSegment {
  id: string;
  text: string;
  type: 'text' | 'foreign';
  translation?: string;
}

export interface ParsedText {
  segments: TextSegment[];
  hasForeignWords: boolean;
}
