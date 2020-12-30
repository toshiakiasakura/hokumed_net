export type Subject  = {
    id: number
    title_ja: string
    title_en: string
    created_at: Date
    updated_at: Date
}

export type Class_Year = {
    id: number
    year: number
    created_at: Date
    updated_at: Date
}

export type SemesterSubjects  ={
    id: number
    class_year_id: number
    class_year: number
    learn_year: number
    learn_term: 'pre' | 'post'
    created_at: Date
    updated_at: Date
    subjects: Subject[]
}
