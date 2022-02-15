import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";


// Entity decorator tells typeorm that this is a database table
// BaseEntity known as the active record pattern allows us to access commands to interact with the db

@ObjectType() // ObjectType decorator allows this class to become a graphql object type
@Entity("users")
export class User extends BaseEntity {

    // User entity model
    // Define the User by creating this User schema

    // Field decorator exposes the fields, we will only show the id and email for this instance
    // Field automatically infers a string, you need to declare Int 
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column("text")
    email: string;

    @Column("text")
    password: string;

    @Column("int", { default: 0 })
    tokenVersion: number;
}
