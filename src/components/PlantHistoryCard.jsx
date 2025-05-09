import React, { useEffect, useRef, useState } from "react";
import { PlantImageContainer, PlantInfoContainer, PlantNameInput, PlantWrapper, StyledButton, StyledButtonContent, StyledDelete, StyledEmptyImageContainer, StyledPlantInfo, StyledPlantInfoInput, StyledPlantName, StyledSelect, StyledTextarea } from "../style/style";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { MyButton } from "./MyButton";
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { calculateAge } from "../utils/util";
import { apiendpoint, fertilizerOptions, sunlightOptions, waterOptions } from "../utils/constantData";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";


export const PlantHistoryCard = ({ plant, isActive, onClick, gardenId, edit, plantAdded, refreshPlants, setNotification }) => {

    const [imagesrc, setImagesrc] = useState('');
    const [loading, setLoading] = useState(false);
    const fetchImage = async () => {
        setLoading(true);
        try {
            const newurl = plant.imageUrl.replace("http://localhost:8080", apiendpoint)
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
            fetchImage();
    }, []);

    const handleDelete = async () => {
        try{
           const res = await axios.delete(`${apiendpoint}/deletePlant/${gardenId}/${plant.id}`);

           refreshPlants(true);
           setNotification({
               show: true,
               variant: 'success',
               message: 'plant deleted'
           });
        }
        catch(e){
           console.log(e);
        }
   }



    return (
            <PlantWrapper isActive = {isActive} onClick={onClick}> 
                {!loading ? <PlantImageContainer>
                    <img style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: '30px', borderTopRightRadius: '30px' }} src={imagesrc} alt="Money Plant" />
                </PlantImageContainer>
                :
                <Spinner width={'100px'} type={'inline'}></Spinner>}
                <PlantInfoContainer>
                    <StyledPlantName>{plant.name}</StyledPlantName>
                    <StyledPlantInfo>Age: {calculateAge(plant.addedOn)}</StyledPlantInfo>
                </PlantInfoContainer>
                <StyledDelete>
                    <DeleteIcon htmlColor="white" onClick={(e) => {
                            e.stopPropagation()
                            if(window.confirm(`Are you sure you want to delete ${plant.name} ?`))
                            handleDelete();
                        }}/>
                </StyledDelete>
            </PlantWrapper>
    )
}