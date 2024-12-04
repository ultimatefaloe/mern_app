import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const activeHttpRequest = useRef ([]);

    const sendHttpRequest = useCallback( async (url, method = 'GET', headers, body = null) => {
        setIsLoading(true);
        const httpAbortController = new AbortController();
        activeHttpRequest.current.push(httpAbortController);

        try{
            const response = await fetch(url,{
                method,
                headers,
                body,
                signal: httpAbortController.signal
            });

            const responseData = await response.json();

            activeHttpRequest.current = activeHttpRequest.current.filter(
                reqCtrl => reqCtrl !== httpAbortController
            );

            if(!response.ok){
                setError(responseData.message)
                throw new Error(responseData.message);
            };
            return responseData
        } catch (err){
            setIsLoading(false);
            setError(err.message);
            throw err.message;
        } finally {
            setIsLoading(false)
        }
    }, []);

    const clearError = () => {
        setError(null);
    };

    useEffect(()=>{
        return () => {
            activeHttpRequest.current.forEach(abrtCtrl => abrtCtrl.abort());
        }
    },[])

    return {sendHttpRequest, isLoading, error, clearError};
};