export interface Survey {
    id: number;
    category: string;
    description: string;
    name: string;
    is_active: boolean;
    ends_at: string;
}

export interface Question {
    id: number;
    survey_id: number;
    answer_count: number;
    question_text: string;
}

export interface Answer {
    id: number;
    question_id_survey_id: number;
    answer_text: string;
    this_answer_count: number;
}


