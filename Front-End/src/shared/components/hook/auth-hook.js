import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState();
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserID] = useState()

    const login = useCallback((uid, token, expirationDate)=>{
        setUserID(uid)
        setToken(token);
        const tokenExpirationTime = expirationDate || new Date( new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationTime);
        localStorage.setItem(
        'userData', 
        JSON.stringify({
            userId: uid, 
            token: token,
            expiration: tokenExpirationTime.toISOString()
        }),
        
        );
    }, []);

    const logout = useCallback(()=>{
        setUserID(null);
        setToken(null);
        setTokenExpirationDate(null);
        localStorage.removeItem('userData')
    }, []);

    useEffect(() => {
        if(token && tokenExpirationDate){
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
            logoutTimer = setTimeout(logout, remainingTime)
        } else {
            clearTimeout(logoutTimer)
        }
    }, [logout, token, tokenExpirationDate])

    useEffect(() => {
        const storedUSerData = JSON.parse(localStorage.getItem('userData'));
        if(
            storedUSerData && 
            storedUSerData.token && 
            new Date(storedUSerData.expiration) > new Date()
        ){
            login(storedUSerData.userId, storedUSerData.token, new Date(storedUSerData.expiration));
        };
    }, [login]);

    return { token, login, logout, userId }
}