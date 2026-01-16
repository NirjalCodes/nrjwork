
export type PlayStyle = 'Solo' | 'Team';

export interface UserProfile {
  name: string;
  grade: string;
  games: string;
  hobbies: string;
  playStyle: PlayStyle;
}

export interface PersonalityReport {
  personalityType: string;
  keyStrengths: string[];
  thinkingWorkStyle: string;
  preferredLearningStyle: string;
  potentialSkillAreas: string[];
  positiveInsight: string;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  report: PersonalityReport | null;
}
