export interface Document_File {
      id: number
      subject_id: number
      user_id: number
      file_name: string
	  file_content_type: string
	  file_kind: 'exam' | 'quiz' | 'summary' | 'personal' 
      comment: string
      download_count: number
      created_at: Date
	  updated_at: Date
}