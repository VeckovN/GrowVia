import { Logger } from "winston";
import { winstonLogger, AuthUserInterface, AuthUserMessageInterface} from "@veckovn/growvia-shared";
import { config } from '@authentication/config';
import { hash } from "bcryptjs";
import { pool } from '@authentication/postgreSQL'; //instance of pool connect not poolConnect method (because its already connected)
import { publishMessage } from "@authentication/rabbitmqQueues/producer";
import { authChannel } from "@authentication/server";

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'authenticationService', 'debug');

function mapAuthUser(row:any): AuthUserInterface {
    return {
        id: row.id,
        username: row.username,
        email: row.email,
        password: row.password,
        ...(row.password && { password: row.password }), //inlcude it if exists in the row
        cloudinaryProfilePublicId: row.cloudinaryprofilepublicid, // Map to camelCase
        profilePicture: row.profilepicture,
        verificationEmailToken: row.verificationemailtoken,
        resetPasswordToken: row.resetpasswordtoken,
        expiresResetPassword: row.expiresresetpassword,
        // createdAt: row.createdat, // If needed
    };
}

//signup
// export async function createUser(userData:AuthUserInterface): Promise<AuthUserInterface> {
export async function createUser(userData:AuthUserInterface): Promise<number> {
    const {
        username,
        password,
        email,
        cloudinaryProfilePublicId,
        profilePicture,
        verificationEmailToken,
        resetPasswordToken,
        expiresResetPassword
    } = userData

    const SALT_ROUND = 10;
    const hashedPassoword = await hash(password as string, SALT_ROUND);
    const createdAtDate = new Date();
    
    const query = `
        INSERT INTO public.auths (
            username, password, email, cloudinaryProfilePublicId, profilePicture, 
            verificationEmailToken, resetPasswordToken, expiresResetPassword, createdAt )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `;

    const values = [
        username, 
        hashedPassoword,
        email,
        cloudinaryProfilePublicId,
        profilePicture,
        verificationEmailToken,
        resetPasswordToken,
        expiresResetPassword,
        createdAtDate, 
    ];

    try {
        const { rows } = await pool.query(query, values);
        const createdUser = rows[0];
        const {password, ...userData} = rows[0]; 
        console.log("User Data ,excluded Password: ", userData);
        const userID:number = createdUser.id ;

        //don't publish message on seed users 
        
        let seed = true; // take it from passed params (userData prop)
        if(!seed){
            const message: AuthUserMessageInterface = {
                id:userID,
                username,
                password,
                email,
                profilePicture,
                type:'auth',
            }
            await publishMessage(
                authChannel,
                'auth-user',
                'auth-user-key',
                'User create message send to user',
                JSON.stringify(message)
            );
        }

        //RETURN ALL USER DATA (same as login/signup )
        //Consider to return needed user Data for loggin (after signup The user must be logged in)
        return userID;
        // return userData;
    }
    catch(error){
        log.log("error", "Authentication service: The user can't be created!");
        //must thrown error because function will return 'undefined'
        //It's better to throw an error from the catch block than to let the function return undefined
        throw new Error("Failed to create user."); 
    }
}

//validate Email (set verificatioEmailToken to null )
export async function updateEmailVerification(userID:number, token:string | null):Promise<boolean>{
    try{
        const {rowCount} = await pool.query(
            `UPDATE public.auths SET verificationEmailToken = $2 WHERE id = $1 `, [userID, token]
        )
        return rowCount === 1 //returns true if a rowCount is 1, otherwise false
    }
    catch(error){
        log.log("error", "Authentication service: The email can't be verified!");
        throw new Error("Failed to verify email."); 
    }
}

//update password, resetPasswordToken and expiresResetPassword 
export async function updatePassword(userID: number, password:string):Promise<boolean>{
    try{
        const {rowCount} = await pool.query(
            `UPDATE public.auths 
             SET password = $1, resetPasswordToken = $2, expiresResetPassword = $3 
             WHERE id = $4`, 
             [password, null, null, userID]
        )
        return rowCount === 1
    }
    catch(error){
        log.log("error", "Authentication service: The password can't be updated!");
        throw new Error("Failed to verify email."); 
    }
}

// //on sending email the experation token time must be set.
export async function updatePasswordTokenExpiration(userID: number, resetToken:string, date:Date):Promise<boolean>{
    try{
        const {rowCount} = await pool.query(
            `UPDATE public.auths 
            SET resetPasswordToken = $1, expiresResetPassword = $2
            WHERE id = $3`,
            [resetToken, date, userID]
        )
        return rowCount === 1
    }   
    catch(error){
        log.log("error", "Authentication service: The password token expiration can't be updated!");
        throw new Error("Failed to verify email."); 
    }
}

export async function getUserByID(userID:number): Promise<AuthUserInterface | undefined>{
    try{
        //Instead of run select to get all data excluding password, we use previous created VIEW with exlcuded password
        const { rows } = await pool.query(
        // ` SELECT * FROM public.auths WHERE id = $1 `, [userID]
        ` SELECT * FROM public.auths_user_without_password WHERE id = $1 `, [userID]
        );
        // if (rows.length === 0)
        //     return undefined
        // const mappedAuthUser = mapAuthUser(rows[0]);
        // return mappedAuthUser   
        return rows.length > 0 ? (mapAuthUser(rows[0])) : undefined;
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}

export async function getUserByEmail(email:string): Promise<AuthUserInterface | undefined>{
    try{
        const { rows } = await pool.query(
        ` SELECT * FROM public.auths WHERE LOWER(email) = LOWER($1) `, [email]
        );
        return rows.length > 0 ? (mapAuthUser(rows[0])) : undefined;
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}

export async function getUserByUsername(username:string): Promise<AuthUserInterface | undefined>{
    try{
        const { rows } = await pool.query(
        ` SELECT * FROM public.auths WHERE LOWER(username) = LOWER($1) `, [username]
        );

        return rows.length > 0 ? (rows[0] as AuthUserInterface) : undefined;
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}

export async function getUserByPasswordToken(token:string): Promise<AuthUserInterface | undefined>{
    try{
        const { rows } = await pool.query(
        ` SELECT * FROM public.auths WHERE resetpasswordtoken = LOWER($1) `, [token] 
        );

        return rows.length > 0 ? (rows[0] as AuthUserInterface) : undefined;
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}

export async function getUserVerificationEmailToken(userID: number): Promise<string | undefined>{
    try{
    const { rows } = await pool.query(
        ` SELECT verificationEmailToken FROM public.auths WHERE id = $1 `, [userID]
        );
        //postgre by default returns props as lowercase if double quote didn't use in selecct like "columnName"  
        return rows.length > 0 ? (rows[0].verificationemailtoken as string) : undefined;
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}
