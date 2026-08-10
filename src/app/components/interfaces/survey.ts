export interface Survey {
    id: number;
    category: string;
    description: string;
    name: string;
    is_active: boolean;
    ends_at: string;
    questions: Question[];
}

export interface Question {
    id: number;
    survey_id: number;
    question_text: string;
    question_type: string;
}

export interface Answer {
    id: number;
    question_id: number;
    answer_text: string;
    answer_count: number;
}


export interface SurveyPreview {

    id: string;
    category: string;
    name: string;
    description: string;
    is_active: boolean;
    ends_at: string;
}
