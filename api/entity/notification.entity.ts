import { Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn } from 'typeorm'

const NULL = {nullable: true, default:null }
@Entity()
export class Notification {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    text: string

    @Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date

    @Column('datetime', NULL)
    updated_at: Date
}
