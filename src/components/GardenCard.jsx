import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { GardenDataContainer, GardenEmptyImgContainer, GardenImgContainer, GardenNameInput, StyledDelete, StyledGardenCard, StyledGardenDetails, StyledGardenName } from "../style/style";
import { MyButton } from "./MyButton";
import AddIcon from '@mui/icons-material/Add';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTodaysDate } from "../utils/util";
import { useNavigate } from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';
import Spinner from "./Spinner";
import { apiendpoint } from "../utils/constantData";

export const GardenCard = ({ garden, edit, gardenAdded, setNotification, refreshGardens, onClickHandler}) => {

    const [imagesrc, setImagesrc] = useState('');
    const [gardenInput, setGardenInput] = useState({ gardenName: '', imageFile: '' });
    const inputRef = useRef(null);
    const today = getTodaysDate();
    const hiddenFileInput = useRef(null);
    const [imageName, setImageName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchImage = async () => {
        setLoading(true);
        try {
            // console.log("IMAGE URL = ", garden.imageUrl)
            const newurl = garden.imageUrl.replace("http://localhost:8080", apiendpoint)
            const response = await axios.get(newurl);
            const base64Image = `data:image/jpeg;base64,${response.data.data}`;
            setImagesrc(base64Image);
            setLoading(false);
        }
        catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!edit)
            fetchImage();
        if (edit) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            setTimeout(() => {
                inputRef.current.focus();
            }, 500);
        }
    }, []);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        if (fileUploaded) {
            setImageName(fileUploaded.name.substr(0, 6) + '...');
            setGardenInput(prevState => ({ ...prevState, imageFile: fileUploaded }));
        }
    };

    const handleEmptyCheck = () => {
        if(gardenInput.gardenName.trim() === '' || !gardenInput.imageFile){
            setNotification(
                {
                    show: true,
                    variant: 'error',
                    message: 'fields cannot be empty'
                }
            )
            return false;
        }
        else
        return true;
    }

    const handleSave = async () => {
        if(handleEmptyCheck()){
            try {
                const formData = new FormData();
                formData.append("image", gardenInput.imageFile);
                formData.append("name", gardenInput.gardenName);
                formData.append("userId", sessionStorage.getItem('userId'));
    
                await axios.post(`${apiendpoint}/addGarden`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                gardenAdded(false);
                setTimeout(() => {
                    setNotification({
                        show: true,
                        variant: 'success',
                        message: 'new garden added'
                    });
                    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                }, '500');
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    const handleDelete = async () => {
         try{
            const res = await axios.delete(`${apiendpoint}/deleteGarden/${garden.id}`);
            console.log("After res = ", res);
            refreshGardens(true);
            setNotification({
                show: true,
                variant: 'success',
                message: 'garden deleted'
            });
         }
         catch(e){
            console.log(e);
         }
    }

    return (
        <StyledGardenCard onClick={onClickHandler}>
            {!edit ?
                <>
                    <GardenDataContainer>
                        <StyledGardenName>{garden.name}</StyledGardenName>
                        <StyledGardenDetails color="white">Created on:</StyledGardenDetails>
                        <StyledGardenDetails color="#749F2A">{garden.createdOn}</StyledGardenDetails>
                        <br />
                        <StyledGardenDetails color="white">Total plants: </StyledGardenDetails>
                        <StyledGardenDetails color="#749F2A">{garden.numberOfPlants}</StyledGardenDetails>
                        <br />
                        <MyButton text={'Add plant'} Icon={<AddIcon fontSize="medium" />} width={'150px'} action = {(e) => {
                            e.stopPropagation();
                            navigate('/bahaar/garden', {state: {garden, edit: true}})
                        }} />
                        <StyledDelete><DeleteIcon htmlColor="white" onClick={(e) => {
                            e.stopPropagation()
                            if(window.confirm(`Are you sure you want to delete ${garden.name} ?`))
                            handleDelete();
                        }}/></StyledDelete>
                    </GardenDataContainer>
                    {!loading ? <GardenImgContainer bgImage={imagesrc}/>
                    :
                    <GardenImgContainer>
                        <Spinner width={'100px'} type={'inline'}></Spinner>
                    </GardenImgContainer>}
                </>
                :
                <>
                    <GardenDataContainer>
                        <GardenNameInput type='text' placeholder='Name your garden' ref={inputRef} value={gardenInput.gardenName} onChange={(e) => setGardenInput({ ...gardenInput, gardenName: e.target.value })} />
                        <br />
                        <StyledGardenDetails color="white">Created on:</StyledGardenDetails>
                        <StyledGardenDetails color="#749F2A">{today}</StyledGardenDetails>
                        <br />
                        <StyledGardenDetails color="white">Total plants: </StyledGardenDetails>
                        <StyledGardenDetails color="#749F2A">{0}</StyledGardenDetails>
                        <br />
                        <MyButton text={'Save'} Icon={<SaveIcon fontSize="medium" />} width={'120px'} action={handleSave} />
                        <StyledDelete><ClearIcon htmlColor="white" onClick={() => gardenAdded(false)}/></StyledDelete>
                    </GardenDataContainer>
                    <GardenEmptyImgContainer width='40%'>
                        <MyButton text={imageName ? imageName : 'Add image'} Icon={<InsertPhotoIcon fontSize="medium" />} width={'150px'} action={handleClick}></MyButton>
                        <input type="file" onChange={handleChange} ref={hiddenFileInput} style={{ display: 'none' }} />
                    </GardenEmptyImgContainer>
                </>
            }
        </StyledGardenCard>
    )
}