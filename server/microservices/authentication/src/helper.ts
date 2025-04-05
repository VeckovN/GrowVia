import { AuthUserInterface } from "@veckovn/growvia-shared"

const mapAuthUser = (row:any): AuthUserInterface => {
    return {
        id: row.id,
        username: row.username,
        email: row.email,
        password: row.password,
        userType: row?.usertype,
        ...(row.password && { password: row.password }), //inlcude it if exists in the row
        verificationEmailToken: row.verificationemailtoken,
        resetPasswordToken: row.resetpasswordtoken,
        expiresResetPassword: row.expiresresetpassword,
        // createdAt: row.createdat, // If needed
    }
}

const getExchangeNameAndRoutingKey = (userType:string): {exchangeName:string, routingKey:string} => {
    switch(userType){
        case 'farmer':
            return {exchangeName: 'auth-user-farmer', routingKey: 'auth-user-farmer-key'}
        case 'customer':
            return {exchangeName: 'auth-user-customer', routingKey: 'auth-user-customer-key'}
        default:
            return {exchangeName: "", routingKey: ""}
    }
}

export {
    mapAuthUser,
    getExchangeNameAndRoutingKey
}
