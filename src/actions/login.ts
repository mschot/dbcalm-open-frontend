
import { Api } from "../utils/api";

export const handleLogin = async (username: string, password: string): Promise<boolean>  => {
    let response = null;
    try {
        response = await Api.post('/auth/authorize', {username, password}, false)
    } catch (error) {
        return false
    }

    if (!response.code) {
        return false

    }

    let tokenResponse = null;
    try {
        tokenResponse = await Api.post('/auth/token', {'grant_type': 'authorization_code', 'code': response.code}, false)
    } catch (error) {
        return false
    }

    if (!tokenResponse.access_token) {
        return false
    }

    const expiryTime = new Date().getTime() + (60 * 60 * 1000);
    localStorage.setItem('token', tokenResponse.access_token);
    localStorage.setItem('tokenExpiry', expiryTime.toString());
    return true
}