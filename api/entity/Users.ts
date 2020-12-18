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

    @Column({default: 'waiting'})
    approval_state: 'waiting' | 'approved'

    @Column(NULL)
    last_login_at: Date

    @Column(NULL)
    last_logout_at: Date

    @Column(NULL)
    last_login_from_ip_address: string

    @Column()
    family_name: string

    @Column()
    given_name: string

    @Column()
    handle_name: string

    @Column(NULL)
    birthday: Date

    @Column(NULL)
    email_mobile: string

    @Column({default: false})
    admin: boolean

    @Column()
    class_year_id: string

    @Column(NULL)
    ml_member_id: number

}
