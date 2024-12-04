import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import './Places.css';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import UploadImage from '../../shared/components/FormElements/ImgUpload';
import { AuthContext } from '../../shared/Context/auth-context';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/components/util/validators';
import { useHttpClient } from '../../shared/components/hook/http-hook';
import { useForm } from '../../shared/components/hook/form-hook';

const NewPlace = () => {

    const auth = useContext(AuthContext);
    const { sendHttpRequest, isLoading, error, clearError} = useHttpClient();

    const [ formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            },
            image: {
                value: null,
                isValid: false
            }
        },
        false
    );
    const history = useHistory();

    const placeAddSubmitInputhandler = async event => {
        event.preventDefault();
        try {
            const coordinates = { lat:7.4037533, lng:3.8092591}
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value);
            formData.append('coordinates[lat]', coordinates.lat); // Pass lat
            formData.append('coordinates[lng]', coordinates.lng);
            await sendHttpRequest(
                process.env.REACT_APP_HTTP_REQUEST_API +'/places/',
                'POST',
                {Authorization: 'Bearer ' + auth.token},
                formData
            );
            history.push('/');
        } catch (err) {
        };   
    };

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <form className='place-form' onSubmit={placeAddSubmitInputhandler}>
                {isLoading && (
                    <div className='center'>
                        <LoadingSpinner asOverlay />
                    </div>
                )}
                <UploadImage
                    id='image'
                    center
                    onInput={inputHandler}
                    errorText='Upload an image'
                />
                <Input 
                    id='title'
                    element='input' 
                    type='text' 
                    label='Title' 
                    placeholder='Title.' 
                    errorText='Please enter a valid Title.' 
                    onInput={inputHandler}
                    validators={[VALIDATOR_REQUIRE()]}
                />
                <Input 
                    id='address'
                    element='input' 
                    type='text' 
                    label='Address' 
                    placeholder='Address.' 
                    errorText='Please enter a valid address.' 
                    onInput={inputHandler}
                    validators={[VALIDATOR_REQUIRE()]}
                />
                <Input 
                    id='description'
                    element='textarea' 
                    label='Description' 
                    placeholder='Description.' 
                    errorText='Enter a description of atleast 5 charc.' 
                    onInput={inputHandler}
                    validators={[VALIDATOR_MINLENGTH(5)]}
                />
                <Button type='submit' disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
        </React.Fragment>
    )
};

export default NewPlace;