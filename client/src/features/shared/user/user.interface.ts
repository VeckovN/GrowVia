export interface UserSettingsPropInterface {
    currentPassword: string,
    newPassword: string,
    repeatPassword: string,
}

export interface UserSocialInterface {
    links:{ 
        name: string,
        url: string
    }[]
}