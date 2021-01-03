import { User } from './user.entity'

export class Subject {
    id: number
    title_ja: string
    title_en: string
    created_at: Date
    updated_at: Date
}

export class Class_Year {
    id: number
    year: number
    created_at: string
    updated_at: string
}

export class SemesterSubjects {
    id: number
    class_year_id: number
    class_year: number
    learn_year: number
    learn_term: 'pre' | 'post'
    created_at: Date
    updated_at: Date
    subjects: Subject[]
}

export class SemesterSubjectsDetail { 
    item: SemesterSubjects
    subjects:  Subject[]
    checkboxes: boolean[]
}

export class File {
    id: number
    subject_id: number
    user_id: number
    file_name: string
    file_content_type: string
    code: number
    comment: string
    download_count: number
    created_at: Date
    updated_at: Date
    file_code: File_Code
    subject: Subject 
    user: User 
}

export class File_Code {
    id: number
    code: number
    kind: string | null
    order: string | null
    type: string | null
}
