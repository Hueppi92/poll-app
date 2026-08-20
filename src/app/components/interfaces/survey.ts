interface Entity {
    id: number;
}

export interface Survey extends Entity {
    category: string;
    description: string;
     title: string;
     ends_at: string;
     done_count: number;
}

export interface Question extends Entity {
     survey_id: number;
     answer_count: number;
     question_text: string;
     allow_multiple: boolean;
}

export interface Answer extends Entity {
    question_id_survey_id: number;
     answer_text: string;
     this_answer_count: number;
}