import { Logger } from "winston";
import { winstonLogger, AuthUserInterface, AuthUserMessageInterface} from "@veckovn/growvia-shared";
import { config } from '@authentication/config';
import { hash } from "bcryptjs";
import { pool } from '@authentication/postgreSQL'; //instance of pool connect not poolConnect method (because its already connected)
import { publishMessage } from "@authentication/rabbitmqQueues/producer";
import { authChannel } from "@authentication/server";

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'authenticationService', 'debug');

//This put in share library or some helpers:
// function mapAuthUser(row:any): AuthUserInterface {
//     return {
//         id: row.id,
//         username: row.username,
//         email: row.email,
//         password: row.password,
//         cloudinaryProfilePublicId: row.cloudinaryprofilepublicid, // Map to camelCase
//         profilePicture: row.profilepicture,
//         verificationEmailToken: row.verificationemailtoken,
//         resetPasswordToken: row.resetpasswordtoken,
//         expiresResetPassword: row.expiresresetpassword,
//         // createdAt: row.createdat, // If needed
//     };
// }


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
        verificationEmailToken,
        resetPasswordToken,
        expiresResetPassword
    } = userData

    const SALT_ROUND = 10;
    const hashedPassoword = await hash(password as string, SALT_ROUND);
    const createdAtDate = new Date();
    
    //On Login function (unCrypt password ->  compare the hashed password stored in the database with the plain text password)
    //const isPasswordValid = await bcrypt.compare(plainTextPassword, storedHashedPassword);
    
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
        console.log('Curetn User rows[0]: ', rows[0]);
        const {password, ...userData} = rows[0]; 
        console.log("User Data ,excluded Password: ", userData);
        const userID:number = createdUser.id ;
        console.log("\n UserID: ", userID);

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
        ` SELECT 
                username,
                email,
                cloudinaryprofilepublicid as cloudinaryProfilePublicId,
                profilepicture as profilePicture,
                verificationemailtoken as verificationEmailToken,
                resetpasswordtoken as resetPasswordToken,
                expiresResetPassword as expiresResetPassword,
                createdat as createdAt
            FROM public.auths_user_without_password 
            WHERE id = $1 `, 
            [userID]
        );

        if (rows.length === 0)
            return undefined


        //maybe due to 'pg-admin' the props aren't retunred as camelCase
        // Manually map to camelCase if necessary
        const mappedAuthUser: AuthUserInterface = {
            username: rows[0].username,
            email: rows[0].email,
            cloudinaryProfilePublicId: rows[0].cloudinaryprofilepublicId,
            profilePicture: rows[0].profilepicture,
            verificationEmailToken: rows[0].verificationemailtoken,
            resetPasswordToken: rows[0].resetpasswordtoken,
            expiresResetPassword: rows[0].expiresResetPassword,
            //Replace this interface with AuthUserDocumentInterface (that contains createtAt)
            // createdAt: rows[0].createdAt
        };

        //TRY DEFINED FUNCTION
        // const mappedAuthUser = mapAuthUser(rows[0]);
        //AND
        // return rows.length > 0 ? mappedAuthUser : undefined; 
        // OR  return rows.length > 0 ? mapAuthUser(rows[0]) : undefined; 
        return mappedAuthUser; 

        // return rows.length > 0 ? (mappedAuthUser as AuthUserInterface) : undefined;    
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}

export async function getUserByEmail(email:string): Promise<AuthUserInterface | undefined>{
    try{
        const { rows } = await pool.query(
        // ` SELECT * FROM public.auths WHERE LOWER(email) = LOWER($1) `, [email]
        // ` SELECT * FROM public.auths_user_without_password WHERE LOWER(email) = LOWER($1) `, [email]
        // ` SELECT * FROM public.auths WHERE LOWER(email) = LOWER($1) `, [email]
        ` SELECT
                id,
                username,
                email,
                password,
                cloudinaryprofilepublicid as cloudinaryProfilePublicId,
                profilepicture as profilePicture,
                verificationemailtoken as verificationEmailToken,
                resetpasswordtoken as resetPasswordToken,
                expiresResetPassword as expiresResetPassword,
                createdat as createdAt
            FROM public.auths
            WHERE LOWER(email) = LOWER($1) `, 
            [email]
        );

        if (rows.length === 0)
            return undefined

        const mappedAuthUser: AuthUserInterface = {
            id:rows[0].id,
            username: rows[0].username,
            email: rows[0].email,
            password: rows[0].password,
            cloudinaryProfilePublicId: rows[0].cloudinaryprofilepublicId,
            profilePicture: rows[0].profilepicture,
            verificationEmailToken: rows[0].verificationemailtoken,
            resetPasswordToken: rows[0].resetpasswordtoken,
            expiresResetPassword: rows[0].expiresResetPassword,
            //Replace this interface with AuthUserDocumentInterface (that contains createtAt)
            // createdAt: rows[0].createdAt
        };

        return mappedAuthUser; 
        
        // return rows.length > 0 ? (rows[0] as AuthUserInterface) : undefined;
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}

export async function getUserByUsername(username:string): Promise<AuthUserInterface | undefined>{
    try{
        const { rows } = await pool.query(
        // ` SELECT * FROM public.auths WHERE LOWER(username) = LOWER($1) `, [username]
        // ` SELECT * FROM public.auths_user_without_password WHERE LOWER(username) = LOWER($1) `, [username]
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
        ` SELECT
                id,
                username,
                email,
                password,
                cloudinaryprofilepublicid as cloudinaryProfilePublicId,
                profilepicture as profilePicture,
                verificationemailtoken as verificationEmailToken,
                resetpasswordtoken as resetPasswordToken,
                expiresResetPassword as expiresResetPassword,
                createdat as createdAt
            FROM public.auths
            WHERE resetpasswordtoken = LOWER($1) `, 
            [token]
        );

        if (rows.length === 0)
            return undefined

        const mappedAuthUser: AuthUserInterface = {
            id:rows[0].id,
            username: rows[0].username,
            email: rows[0].email,
            password: rows[0].password,
            cloudinaryProfilePublicId: rows[0].cloudinaryprofilepublicId,
            profilePicture: rows[0].profilepicture,
            verificationEmailToken: rows[0].verificationemailtoken,
            resetPasswordToken: rows[0].resetpasswordtoken,
            expiresResetPassword: rows[0].expiresResetPassword,
            //Replace this interface with AuthUserDocumentInterface (that contains createtAt)
            // createdAt: rows[0].createdAt
        };

        return mappedAuthUser; 
        // return rows.length > 0 ? (rows[0] as AuthUserInterface) : undefined;
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}

export async function getUserVerificationEmailToken(userID: number): Promise<string | undefined>{
    try{
    const { rows } = await pool.query(
        // ` SELECT * FROM public.auths WHERE id = $1 `, [userID]
        ` SELECT verificationEmailToken FROM public.auths WHERE id = $1 `, [userID]
        );

        //postgre by default returns props as lowercase if double quote didn't use in selecct like "columnName"  
        return rows.length > 0 ? (rows[0].verificationemailtoken as string) : undefined;
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}
