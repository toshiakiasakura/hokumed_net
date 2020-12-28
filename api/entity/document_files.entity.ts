import { Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn } from 'typeorm'

  @Entity()
  export class Document_Files {

      @PrimaryGeneratedColumn()
      id: number

      @Column()
      title: string

      @Column()
      text: string

      @Column()
      created_at: Date

      @Column()
      updated_at: Date
  }
