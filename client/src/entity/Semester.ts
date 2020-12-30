import { Subject } from "./Subject";

export interface Semester {
	id: number
	class_year_id: number
	learn_year: number
	learn_term: 'pre' | 'post'
	created_at: Date
	updated_at: Date
	subjects: Subject[]
}