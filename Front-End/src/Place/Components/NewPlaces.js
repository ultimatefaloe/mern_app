import React, { useState } from 'react';

import './NewPlaces.css'

const EnterNewUserItem = props => {
    const [enterName, setEnterName  ]= useState('');
    const [enterPlace, setEnterPlace ] = useState('');
    const saveToUserdb = e =>{
        e.preventDefault();
        const newItem = {
            id: Math.random().toString(),
            name:enterName,
            image:'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*oM1GuZ0oC3_9v1GfKC2Egg.jpeg',
            places: enterPlace
        }
        props.onAddItem(newItem);
        setEnterName('');
        setEnterPlace('');

    };
    const addNewUserItemName = e => {
        setEnterName(e.target.value);
    };
    const addNewUserItemPlace = e => {
        setEnterPlace(e.target.value)
    };


    return (
        <div className='form_con'>
        <form onSubmit={saveToUserdb} className='form_input'>
            <div className='input_con'>
                <label>Full name</label><br />
                <input type='text' value={enterName} onChange={addNewUserItemName} placeholder='Enter Full Name: ' />
            </div>
            <div className='input_con'>
                <label>Place/Places</label><br />
                <input type='number' value={enterPlace} onChange={addNewUserItemPlace}  placeholder='Enter Number of Places:'/>
            </div>
            <div className='btn'>
                <input type='submit' />
            </div>
        </form>
    </div>
    );
};
export default EnterNewUserItem;