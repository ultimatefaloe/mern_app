import React from 'react';

import PlaceItem from './PlaceItem';
import Card from '../../shared/components/UIElements/Card'
import './PlaceList.css'
import Button from '../../shared/components/FormElements/Button';

const PlaceList = props => {
 if(props.items.length === 0)
    return(
        <div className='place-list center'>
            <Card>
                <h2>No Places Found. May be create one?</h2>
                <Button to='/place/new'>Share Places</Button>
            </Card>
        </div>
    )
    return(
        <ul className='place-list'>
            {props.items.map(place => 
                <PlaceItem 
                    key={place.id} 
                    id={place.id} 
                    title={place.title} 
                    image={place.image} 
                    address={place.address} 
                    creatorId={place.creator} 
                    description={place.description} 
                    cordinate={place.location} 
                    onDelete={props.onDeletePlace} 
                />
            )}
        </ul>
    )
};

export default PlaceList;