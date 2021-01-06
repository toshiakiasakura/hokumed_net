import { Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn } from 'typeorm'

const NULL = {nullable: true, default:null }
const NULL_STRING = {type: 'varchar', nullable: true, default: null}
@Entity()
export class Document_File {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  subject_id: number

  @Column()
  class_year: number

  @Column()
  user_id: number

  @Column()
  file_name: string

  @Column('varchar', NULL_STRING)
  file_content_type: string

  @Column()
  code: number

  @Column('varchar', NULL_STRING)
  comment: string

  @Column({default: () => 0})
  download_count: number

  @Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
  created_at: Date

  @Column('datetime', NULL)
  updated_at: Date
}

@Entity()
export class Semester_Subject {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  semester_id: number

  @Column()
  subject_id: number
}


@Entity()
export class Semester {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  class_year_id: number

  @Column()
  learn_year: number

  @Column()
  learn_term: 'pre' | 'post'

  @Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
  created_at: Date

  @Column('datetime', NULL)
  updated_at: Date
}


@Entity()
export class Subject {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title_ja: string

  @Column()
  title_en: string

  @Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
  created_at: Date

  @Column('datetime', NULL)
  updated_at: Date
}

@Entity()
export class Class_Year {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  year: number

  @Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
  created_at: Date

  @Column('datetime', NULL)
  updated_at: Date
}

@Entity()
export class File_Code {
  
  @PrimaryGeneratedColumn()
  id: number
  
  @Column()
  code: number

  @Column()
  kind: string

  @Column('varchar', NULL_STRING)
  no_doc: string

  @Column('varchar', NULL_STRING)
  type: string

}