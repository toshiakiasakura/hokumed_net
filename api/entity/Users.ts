import { Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn } from "typeorm";


const NULL = {nullable: true}

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    // Check this NULL is valid or not.
    @Column()
    crypted_password: string

    @Column()
    salt: string

    @Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date

    @Column(NULL)
    updated_at: Date

    @Column({default: 'pending'})
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
