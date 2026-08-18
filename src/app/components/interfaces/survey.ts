interface Entity {
    readonly id: number;
}

export interface Survey extends Entity {
    readonly category: string;
    readonly description: string;
    readonly title: string;
    readonly ends_at: string;
}

export interface Question extends Entity {
    readonly survey_id: number;
    readonly answer_count: number;
    readonly question_text: string;
}

export interface Answer extends Entity {
    readonly question_id_survey_id: number;
    readonly answer_text: string;
    readonly this_answer_count: number;
}