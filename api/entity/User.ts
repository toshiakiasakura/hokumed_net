import { Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn } from "typeorm";


const NULL = {nullable: true}
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    // Check this NULL is valid or not.
    @Column(NULL)
    crypted_password: string

    @Column(NULL)
    salt: string

    @Column(NULL)
    created_at: number

    @Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
    updated_at: Date

    @Column(NULL)
    activation_state: string

    @Column(NULL)
    activation_token: string

    @Column(NULL)
    activation_token_expires_at: Date

    @Column(NULL)
    family_name: string

    @Column(NULL)
    given_name: string

    @Column(NULL)
    handle_name: string

}
