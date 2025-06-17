export const saveDataToLocalStorage = (key: string, data: string): void =>{
    //data object should be JSON stringified
    window.localStorage.setItem(key, data);
}

export const getDataFromLocalStorage = (key: string) =>{
    const data:string = window.localStorage.getItem(key) as string;
    return JSON.parse(data); //convert from string to JSON object
}

export const removeDataFromLocalStorage = (key:string): void => {
    window.localStorage.removeItem(key);
}

export const saveDataToSessionStorage = (data: string, username: string): void =>{
    window.sessionStorage.setItem('isLoggedIn', data); //true/false
    window.sessionStorage.setItem('loggedInUser', username); //
}

export const removeUserFromSessionStorage = (): void => {
    window.sessionStorage.removeItem('isLoggedIn'); 
    window.sessionStorage.removeItem('loggedInUser'); 
}

export const getDataFromSessionStorage = (key: string) => {
    const data:string = window.sessionStorage.getItem(key) as string;
    return JSON.parse(data);
}

export const removeDataFromSessionStorege = (key: string) =>{
    window.sessionStorage.removeItem(key);
}