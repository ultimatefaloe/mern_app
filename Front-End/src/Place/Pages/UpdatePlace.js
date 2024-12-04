import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import './Places.css';
import { useHttpClient } from '../../shared/components/hook/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/Context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card'
import { useParams } from 'react-router-dom'; 
import { useForm } from '../../shared/components/hook/form-hook';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/components/util/validators';

const UpdatePlace = () => {
    const history = useHistory()
    const { sendHttpRequest, isLoading, error, clearError } = useHttpClient();
    const auth = useContext(AuthContext);
    const [loadedPlace, setLoadPlace] = useState();
    const placeId = useParams().placeId;

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        false
    );

    useEffect( ()=>{
        const fetchPlace = async () => {
            try{
                const responseData = await sendHttpRequest(`http://localhost:5000/api/places/${placeId}`);

                setLoadPlace(responseData.place);

                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true
                        }
                    },
                    true
                );
            } catch (err) {};
        }
        fetchPlace();
    }, [sendHttpRequest, placeId, setFormData, setLoadPlace]);

    const onUpdatePlaceSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendHttpRequest(
                `${process.env.REACT_APP_HTTP_REQUEST_API}/places/${placeId}`, 
                'PATCH',
                {
                    'Content-Type' : 'application/json',
                    Authorization: 'Bearer ' + auth.token
                },
                JSON.stringify({
                    title:formState.inputs.title.value,
                    description: formState.inputs.description.value
                })
            );
            history.push('/' + auth.userId + '/places')
        } catch (err) {}
    };

    if (isLoading) {
        return (
            <div className="center">
                <Card>
                    <LoadingSpinner asOverlay />
                </Card>
            </div>
        );
    }

    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>No Places Found!</h2>
                </Card>
            </div>
        );
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && (
                <form className="place-form" onSubmit={onUpdatePlaceSubmitHandler}>
                    <Input
                        id="title"
                        type="text"
                        element="input"
                        label="Title"
                        initialValue={loadedPlace.title}
                        initialValidity={true}
                        onInput={inputHandler}
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title"
                    />
                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        initialValue={loadedPlace.description}
                        initialValidity={true}
                        onInput={inputHandler}
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description"
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        Update Place
                    </Button>
                </form>
            )}
        </React.Fragment>
    );
};

export default UpdatePlace;
