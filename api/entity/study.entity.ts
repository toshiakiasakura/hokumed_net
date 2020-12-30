import { Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn } from 'typeorm'
import { User } from './user.entity'

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

    @Column()
    file_content_type: string

    @Column({nullable: true, default:null})
    comment: string

    @Column()
    download_count: number

    @Column()
    created_at: Date

    @Column()
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

    @Column()
    created_at: Date

    @Column()
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

    @Column()
    created_at: Date

    @Column()
    updated_at: Date
}

@Entity()
export class Class_Year {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    year: number

    @Column()
    created_at: Date

    @Column()
    updated_at: Date
}
