import { Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn } from 'typeorm'

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
