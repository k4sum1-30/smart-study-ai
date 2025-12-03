export enum StudyMode {
  REVIEW = 'REVIEW',
  PREVIEW = 'PREVIEW',
  QUIZ = 'QUIZ',
  MIDTERM = 'MIDTERM',
  FINAL = 'FINAL',
  CODE_INTERPRETER = 'CODE_INTERPRETER',
  FULL_COURSE_PPT = 'FULL_COURSE_PPT'
}

export interface QuizQuestion {
  type?: 'MCQ' | 'TF' | 'OPEN'; // Default to MCQ if undefined
  question: string;
  options?: string[]; // Required for MCQ and TF
  correctAnswerIndex?: number; // Required for MCQ and TF
  explanation: string; // Model answer for OPEN
  optionExplanations?: string[]; // Explanations for each option
  codeSnippet?: string; // Code template for OPEN questions
  diagramPrompt?: string; // Description for AI image generation (Robotics questions)
  diagramUrl?: string; // Generated diagram URL (populated after generation)
}

export interface Slide {
  title: string;
  bulletPoints: string[];
  explanation: string; // Speaker notes
}

export interface StudySessionState {
  mode: StudyMode | null;
  isLoading: boolean;
  error: string | null;
  textContent: string | null; // Markdown content for Review/Preview
  quizContent: QuizQuestion[] | null; // Structured content for Quiz
  pptContent: Slide[] | null; // Content for PPT mode
}

export interface UploadedFile {
  file: File;
  base64: string;
  mimeType: string;
}