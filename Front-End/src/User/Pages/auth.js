import React, { useState, useContext } from 'react';

import './auth.css';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import UploadImage from '../../shared/components/FormElements/ImgUpload';
import { useHttpClient } from '../../shared/components/hook/http-hook';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/components/util/validators'
import { useForm } from '../../shared/components/hook/form-hook';
import { AuthContext } from '../../shared/Context/auth-context';

const Auth = () => {

    const auth = useContext(AuthContext)

    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendHttpRequest, clearError} = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        email:{
            value: '',
            isValid: false
        },
        password:{
            value: '',
            isValid: false
        }
    },false);

    const switchModeHandler = () => {
        if(!isLoginMode){
            setFormData({
                ...formState.inputs,
                name:undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        } else {
            setFormData({
                ...formState.inputs,
                name:{
                    value:'',
                    isVlaid:false
                },
                image: {
                    value: null,
                    isValid: false
                }
            } , false)
        }
        setIsLoginMode(prevLoad => !prevLoad)
    };
    const authSubmitHandler = async event => {
        event.preventDefault();

        if(isLoginMode){
            try {
                const responseData = await sendHttpRequest(
                    process.env.REACT_APP_HTTP_REQUEST_API + '/users/login', 
                    'POST',
                    { 'Content-Type': 'application/json'},
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                );
                auth.login(responseData.userId, responseData.token);
            } catch (err) {}
        }else{
            try {
                const formData = new FormData();
                formData.append('name', formState.inputs.name.value);
                formData.append('email', formState.inputs.email.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData = await sendHttpRequest(
                    process.env.REACT_APP_HTTP_REQUEST_API + '/users/signup',
                    'POST',
                    {},
                    formData
                );
                auth.login(responseData.userId, responseData.token);
            } catch (err) {}
        };

    }

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className='center'>
                    <LoadingSpinner asOverlay />
                </div>
            )}
            <Card className='authentication'>
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <UploadImage 
                            id='image'
                            center
                            onInput={inputHandler}
                            errorText='Upload an image'
                        />
                    )}
                    {!isLoginMode && (
                        <Input 
                        element='input' 
                        id='name' 
                        type='text' 
                        title='Name' 
                        label='name'
                        validators={[VALIDATOR_REQUIRE]}
                        errorText='Please enter a name'
                        onInput={inputHandler}
                        />
                    )}
                    <Input 
                        element='input' 
                        id='email' 
                        type='email' 
                        title='E-Mail' 
                        label='email'
                        validators={[VALIDATOR_EMAIL]}
                        errorText='Please enter a valid email'
                        onInput={inputHandler}
                    />
                    <Input 
                        element='input' 
                        id='password' 
                        type='password' 
                        title='Password' 
                        label='passsword'
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText='Please enter a valid password, atleast 6 characters.'
                        onInput={inputHandler}
                    />
                    <Button type='submit' disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler} >
                    SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN' }
                </Button>
            </Card>
        </React.Fragment>
    )
}

export default Auth;