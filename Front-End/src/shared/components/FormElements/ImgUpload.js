import React, { useRef,useState, useEffect }from 'react';

import './ImgUpload.css';
import Button from './Button';

const UploadImage = props => {
    const uploadRef = useRef();
    const [file, setFile] = useState();
    const [isValid, setISValid] = useState(false);
    const [previewUrl, setPreviewUrl] = useState();

    useEffect(()=>{
        if(!file){
            return;
        };
        const fileReader = new FileReader();
        fileReader.onload = ()=>{
            setPreviewUrl(fileReader.result)
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const uploadFile = event => {
        let selectedfile
        let fileIsValid = isValid

        if(event.target.files && event.target.files.length === 1){
            selectedfile = event.target.files[0]
            setFile(selectedfile);
            setISValid(true);
            fileIsValid = true
        } else{
            setISValid(false);
            fileIsValid = false;
        };

        props.onInput(props.id, selectedfile, fileIsValid)
    };

    const imgUpdDisplay = () => {
        uploadRef.current.click();
    };
    

    return (
        <div className='form-control'>
            <input 
                type='file' 
                ref={uploadRef}
                id={props.id}
                style={{display: 'none'}}
                accept='.png, .jpg, .jpeg'
                onChange={uploadFile}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview' >
                        {previewUrl && <img src={previewUrl} alt={props.id} />}
                        {!previewUrl && <p>Please upload an image.</p>}
                </div>
                <Button type='button' onClick={imgUpdDisplay}>Upload an image</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    )
}

export default UploadImage;