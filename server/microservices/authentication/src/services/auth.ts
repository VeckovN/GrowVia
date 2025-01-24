import { Logger } from "winston";
import { winstonLogger, AuthUserInterface, AuthUserMessageInterface } from "@veckovn/growvia-shared";
import { config } from '@authentication/config';
import { hash } from "bcryptjs";
import { pool } from '@authentication/postgreSQL'; //instance of pool connect not poolConnect method (because its already connected)
import { publishMessage } from "@authentication/rabbitmqQueues/producer";
import { authChannel } from "@authentication/server";

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'authenticationService', 'debug');

//signup
// export async function createUser(userData:AuthUserInterface):Promise<void> {
// export async function createUser(userData:AuthUserInterface): Promise<AuthUserInterface> {
export async function createUser(userData:AuthUserInterface): Promise<number> {
    const {
        username,
        password,
        email,
        cloudinaryProfilePublicId,
        profilePicture,
        verificatioEmailToken,
        resetPasswordToken,
        exipresResetPassword
    } = userData

    const SALT_ROUND = 10;
    const hashedPassoword = await hash(password, SALT_ROUND);
    const createdAtDate = new Date();
    
    //On Login function (unCrypt password ->  compare the hashed password stored in the database with the plain text password)
    //const isPasswordValid = await bcrypt.compare(plainTextPassword, storedHashedPassword);
    
    const query = `
        INSERT INTO public.auths (
            username, password, email, cloudinaryProfilePublicId, profilePicture, 
            verificatioEmailToken, resetPasswordToken, exipresResetPassword, createdAt )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `;

    const values = [
        username, 
        hashedPassoword,
        email,
        cloudinaryProfilePublicId,
        profilePicture,
        verificatioEmailToken,
        resetPasswordToken,
        exipresResetPassword,
        createdAtDate, 
    ];

    try {
        const { rows } = await pool.query(query, values);

        const createdUser = rows[0];
        const userID:number = createdUser.id ;

        //publish Message
        const message: AuthUserMessageInterface = {
            id:userID,
            username,
            password,
            email,
            profilePicture,
            type:'auth',
        }

        //authChannel -> should be imported 
        await publishMessage(
            authChannel,
            'auth-user',
            'auth-user-key',
            'User create message send to user',
            JSON.stringify(message)
        );

        return userID;
    }
    catch(error){
        log.log("error", "Authentication service: The user can't be created!");
        //must thrown error because function will return 'undefined'
        //It's better to throw an error from the catch block than to let the function return undefined
        throw new Error("Failed to create user."); 
    }
}

export async function getUserByID(userID:number): Promise<AuthUserInterface | undefined>{
    try{
        //Instead of run select to get all data excluding password, we use previous created VIEW with exlcuded password
        const { rows } = await pool.query(
        // ` SELECT * FROM public.auths WHERE id = $1 `, [userID]
        ` SELECT * FROM public.auths_user_without_password WHERE id = $1 `, [userID]
        );

        return rows.length > 0 ? (rows[0] as AuthUserInterface) : undefined;
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}

export async function getUserByEmail(email:string): Promise<AuthUserInterface | undefined>{
    try{
        const { rows } = await pool.query(
        // ` SELECT * FROM public.auths WHERE LOWER(email) = LOWER($1) `, [email]
        ` SELECT * FROM public.auths_user_without_password WHERE LOWER(email) = LOWER($1) `, [email]
        );

        return rows.length > 0 ? (rows[0] as AuthUserInterface) : undefined;
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}

export async function getUserByUsername(username:string): Promise<AuthUserInterface | undefined>{
    try{
        const { rows } = await pool.query(
        // ` SELECT * FROM public.auths WHERE LOWER(username) = LOWER($1) `, [username]
        ` SELECT * FROM public.auths_user_without_password WHERE LOWER(username) = LOWER($1) `, [username]
        );

        return rows.length > 0 ? (rows[0] as AuthUserInterface) : undefined;
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}
