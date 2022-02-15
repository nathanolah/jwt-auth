import { 
    Resolver, 
    Query, 
    Mutation, 
    Arg, 
    ObjectType, 
    Field, 
    Ctx, 
    UseMiddleware,
    Int
} from 'type-graphql';
import { User } from './entity/User';
import { hash, compare } from 'bcryptjs';
import { MyContext } from './MyContext';
import { createAccessToken, createRefreshToken } from './auth';
import { isAuth } from './isAuth';
import { sendRefreshToken } from './sendRefreshToken';
import { getConnection } from 'typeorm';
import { verify } from 'jsonwebtoken';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
    @Field(() => User)
    user: User;
}

@Resolver()
export class UserResolver {

    @Query(() => String)
    hello() {
        return "hi!";
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    bye(@Ctx() {payload} : MyContext) {
        console.log(payload);
        return `Your user id is: ${payload!.userId}`;
    }

    // Returns an array of Users hence the [User] array
    @Query(() => [User])
    users() {
        return User.find();
    }

    // Parses the user id from the current access token, return the user details.
    // nullable allows to send back null responses
    @Query(() => User, { nullable: true })
    me(
        @Ctx() context: MyContext
    ) {
        const authorization = context.req.headers['authorization'];

        if (!authorization) {
            return null;
        }

        try {
            // bearer 109324344wer344r
            const token = authorization?.split(' ')[1];
            const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
            
            // The payload contains the user.id
            return User.findOne(payload.userId)
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    @Mutation(() => Boolean)
    async logout(
        @Ctx() {res}: MyContext
    ) {
        sendRefreshToken(res, "");

        return true;
    }

    @Mutation(() => Boolean)
    async revokeRefreshTokensForUser(
        @Arg('userId', () => Int) userId: number
    ) {
        await getConnection()
            .getRepository(User)
            .increment({id: userId}, 'tokenVersion', 1);

        return true;
    }


    // Mutations are used to perform CRUD operations on the database
    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() {res}: MyContext
    ): Promise<LoginResponse> { // This function returns a Promise of LoginResponse 

        // Search db to find the user email
        const user = await User.findOne({ where: { email } });
        
        if (!user) { 
            throw new Error('User does not exist');
        }

        const valid = await compare(password, user.password)

        if (!valid) {
            throw new Error('Password is incorrect');
        }

        /** Login is successful **/

        // Create a cookie and store a refresh token
        // if the user hasn't visited the site for 7 days make them relogin.
        sendRefreshToken(res, createRefreshToken(user));

        // create the access token and return the LoginResponse
        return {
            accessToken: createAccessToken(user),
            user
        };

    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string,
    ) {
        const hashedPassword = await hash(password, 12);

        try {
            await User.insert({
                email,
                password: hashedPassword
            });
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }

}