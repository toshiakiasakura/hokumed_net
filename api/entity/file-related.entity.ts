import { Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn } from 'typeorm'

  @Entity()
  export class Document_Files {

      @PrimaryGeneratedColumn()
      id: number

      @Column()
      subject_id: number

      @Column()
      user_id: number

      @Column()
      file_name: string

      @Column()
      file_content_type: string

      @Column()
      comment: string

      @Column()
      download_count: number

      @Column()
      created_at: Date

      @Column()
      updated_at: Date
  }

@Entity()
export class Semesters_Subjects {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    subject_id: number

    @Column()
    created_at: Date

    @Column()
    updated_at: Date
}


@Entity()
export class Semesters {

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
export class Subjects {

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
export class Class_Years {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    year: number

    @Column()
    created_at: Date

    @Column()
    updated_at: Date
}
