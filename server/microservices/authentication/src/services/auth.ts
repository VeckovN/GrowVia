import { Logger } from "winston";
import { winstonLogger, BadRequestError, AuthUserInterface, AuthUserTypeMessageInterface, CustomerDocumentInterface, FarmerDocumentInterface} from "@veckovn/growvia-shared";
import { config } from '@authentication/config';
import { hash } from "bcryptjs";
import { pool } from '@authentication/postgreSQL'; //instance of pool connect not poolConnect method (because its already connected)
import { publishMessage } from "@authentication/rabbitmqQueues/producer";
import { authChannel } from "@authentication/server";
import { mapAuthUser, getExchangeNameAndRoutingKey } from "@authentication/helper";

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'authenticationService', 'debug');

export async function createUser(
    userData:AuthUserInterface, 
    userTypeData: CustomerDocumentInterface | FarmerDocumentInterface
): Promise<string> {
    const {
        username,
        password,
        email,
        userType,
        verificationEmailToken,
        resetPasswordToken,
        expiresResetPassword
    } = userData

    console.log("userDATA: ", userData);

    const SALT_ROUND = 10;
    const hashedPassoword = await hash(password as string, SALT_ROUND);
    const createdAtDate = new Date();
    
    const query = `
        INSERT INTO public.auths (
            username, password, email, userType, verificationEmailToken, 
            resetPasswordToken, expiresResetPassword, createdAt )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;

    const values = [
        username, 
        hashedPassoword,
        email,
        userType,
        verificationEmailToken,
        resetPasswordToken,
        expiresResetPassword,
        createdAtDate, 
    ];

    try {
        const { rows } = await pool.query(query, values);
        console.log("\n User Specific Data: ", userTypeData);
        const createdUser = rows[0];
        const userID = createdUser.id;

        if(userType !== 'customer' && userType !== 'farmer')
            throw BadRequestError("Invalid user Type", "Authentication create user seeder function error");

        const messagePayload: AuthUserTypeMessageInterface = {
            type:'authCreate',
            data: {userID:userID, ...userTypeData} 
        }
        const {exchangeName, routingKey} = getExchangeNameAndRoutingKey(userType);

        console.log("Message Payload: ", messagePayload);

        await publishMessage(
            authChannel,
            exchangeName,
            routingKey,
            'User create message send to user',
            JSON.stringify(messagePayload)
        );

        return userID;
        // return userData;
    }
    catch(error){
        log.log("error", "Authentication service: The user can't be created!");
        //must thrown error because function will return 'undefined'
        //It's better to throw an error from the catch block than to let the function return undefined
        // throw new Error("Failed to create user.", error); 
        throw BadRequestError(`Failed to create user: ${error} `, "auth service create user fucntiojn error");
    }
}

//validate Email (set verificatioEmailToken to null )
export async function updateEmailVerification(userID:string, token:string | null):Promise<boolean>{
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
export async function updatePassword(userID: string, password:string):Promise<boolean>{
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
export async function updatePasswordTokenExpiration(userID: string, resetToken:string, date:Date):Promise<boolean>{
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


export async function getUserByID(userID:string, withPassword = false): Promise<AuthUserInterface | undefined>{
    try{
        const query = withPassword
            ? `SELECT * FROM public.auths WHERE id = $1`
            : `SELECT * FROM public.auths_user_without_password WHERE id = $1`;
    
        const { rows } = await pool.query(query, [userID]);
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
        // return rows.length > 0 ? (rows[0] as AuthUserInterface) : undefined;
        return rows.length > 0 ? (mapAuthUser(rows[0])) : undefined;
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

        return rows.length > 0 ? (mapAuthUser(rows[0])) : undefined;
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}

export async function getUserByVerificationEmailToken(token:string): Promise<AuthUserInterface | undefined>{
    try{
        const { rows } = await pool.query(
        ` SELECT * FROM public.auths WHERE verificationEmailToken = LOWER($1) `, [token] 
        );

        return rows.length > 0 ? (mapAuthUser(rows[0])) : undefined;
    }
    catch(error){
        log.log("error", "Authentication service can't get the user by id. Error: ", error);
    }
}

export async function getUserVerificationEmailToken(userID: string): Promise<string | undefined>{
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
