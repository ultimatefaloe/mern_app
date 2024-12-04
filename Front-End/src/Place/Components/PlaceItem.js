import React, { useState, useContext } from 'react';

import './PlaceItem.css';
import { useHttpClient } from '../../shared/components/hook/http-hook';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import { AuthContext } from '../../shared/Context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const PlaceItem = props => {

    const auth = useContext(AuthContext);
    const { sendHttpRequest, isLoading, error, clearError} = useHttpClient();

    const [showMap, setShowMap] = useState(false);
    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const openDeleteModalHandler = () =>{
        setShowDeleteModal(true)
    };
    const closeDeleteModalHandler = () =>{
        setShowDeleteModal(false)
    };
    const confirmDeleteHandler = async () =>{
        setShowDeleteModal(false);
        try {
            await sendHttpRequest(
                `${process.env.REACT_APP_HTTP_REQUEST_API}/places/${props.id}`,
                'DELETE',
                {Authorization: 'Bearer ' + auth.token},
            );
            props.onDelete(props.id);
        } catch (err) { };
    };

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap}
                header={props.address}
                onCancel={closeMapHandler}
                contentClass='place-item__modal-content'
                footerClass='place-item__modal-actions'
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className='map-container'>
                    <h2>The Map!</h2>
                </div>
            </Modal>
            <Modal
                show={showDeleteModal}
                onCancel={closeDeleteModalHandler}
                header='Confirm Delete?'
                contentClass='place-item__modal-content'
                footerClass='place-item__modal-actions'
                footer={
                    <React.Fragment>
                        <Button inverse onClick={closeDeleteModalHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                    </React.Fragment>
                }
            >
                <p>Are you sure you want to delete, once delete it can be undone!</p>
            </Modal>
            <li>
                <Card className='place-item__content'>
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className='place-item__image'>
                        <img src={`${process.env.REACT_APP_ASSET_HTTP_REQUEST_API}/${props.image}`} alt={props.title} />
                    </div>
                    <div className='place-item__info'>
                        <h1>{props.title}</h1>
                        <h2>{props.address}</h2>
                        <p>{props.description}</p>
                    </div>
                    <div className='place-item__actions'>
                        <Button inverse onClick={openMapHandler} >VIEW ON MAP</Button>
                        {auth.userId === props.creatorId && (
                            <Button to={`/place/${props.id}`}>EDIT</Button>
                        )}
                        {auth.userId === props.creatorId && (
                            <Button danger onClick={openDeleteModalHandler}>DELETE</Button>
                        )}
                    </div>
                </Card>
            </li>
        </React.Fragment>
      )
};

export default PlaceItem;