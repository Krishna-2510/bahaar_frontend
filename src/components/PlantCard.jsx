import React, { useEffect, useRef, useState } from "react";
import { PlantImageContainer, PlantInfoContainer, PlantNameInput, PlantWrapper, StyledButton, StyledButtonContent, StyledDelete, StyledEmptyImageContainer, StyledPlantInfo, StyledPlantInfoInput, StyledPlantName, StyledSelect, StyledTextarea } from "../style/style";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { MyButton } from "./MyButton";
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import axios from "axios";
import { calculateAge } from "../utils/util";
import { apiendpoint, fertilizerOptions, sunlightOptions, waterOptions } from "../utils/constantData";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";


export const PlantCard = ({ plant, gardenId, edit, plantAdded, refreshPlants, setNotification }) => {
    
    //console.log('GARDEN ID =', gardenId)

    const navigate = useNavigate();

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

    const plantNameRef = useRef(null);

    const hiddenFileInput = useRef(null);
    const [imageName, setImageName] = useState('');

    const [plantInput, setPlantInput] = useState({
        plantName: '',
        water: 'Select an option',
        sunlight: 'Select an option',
        fertilizer: 'Select an option',
        note: '',
        imageFile: ''
    })

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        if (fileUploaded) {
            setImageName(fileUploaded.name.substr(0, 6) + '...');
            setPlantInput(prevState => ({ ...prevState, imageFile: fileUploaded }));
        }
    };

    useEffect(() => {
        if(edit){
            setTimeout(() => {
                if (plantNameRef.current) {
                plantNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Bring focus to the textarea
            }
            },10)
        }
        else{
            fetchImage()
        }
    }, [edit]);

    const handleEmptyCheck = () => {
        if(plantInput.plantName.trim() === '' || !plantInput.imageFile || plantInput.fertilizer === 'Select an option' || plantInput.note === '' || plantInput.sunlight === 'Select an option' || plantInput.water === 'Select an option' || plantInput.sunlight === 'Select an option'){
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

        console.log("THIS IS THE DATA = ", plantInput, 'And this is the gerden id ', gardenId)
        if(handleEmptyCheck()){
            try {
                const formData = new FormData();
                formData.append("image", plantInput.imageFile);
                formData.append("water", plantInput.water);
                formData.append("sunlight", plantInput.sunlight);
                formData.append("fertilizer", plantInput.fertilizer);
                formData.append("name", plantInput.plantName);
                formData.append("note", plantInput.note);
                formData.append("gardenId", gardenId);
    
                await axios.post(`${apiendpoint}/addPlant`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                plantAdded(false);
                setTimeout(() => {
                    setNotification({
                        show: true,
                        variant: 'success',
                        message: 'new plant added'
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
           const res = await axios.delete(`${apiendpoint}/deleteAllPlant/${plant.name}/${gardenId}`);
           console.log("After res = ", res);
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

   const loadPlantDetails = (plant) => {
    navigate('/bahaar/plant', {state: { plant, image: imagesrc }})
}


    return (
        !edit ?
            <PlantWrapper onClick={() => loadPlantDetails(plant, imagesrc)}>
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
                            if(window.confirm(`This will delete all the entries for ${plant.name}, are you sure you want to delete it?`))
                            handleDelete();
                        }}/>
                </StyledDelete>
            </PlantWrapper>
            :
            <PlantWrapper>
                <StyledEmptyImageContainer>
                <MyButton text={imageName ? imageName : 'Add image'} Icon={<InsertPhotoIcon fontSize="medium" />} width={'150px'} action={handleClick}></MyButton>
                <input type="file" onChange={handleChange} ref={hiddenFileInput} style={{ display: 'none' }} />
                </StyledEmptyImageContainer>
                <PlantNameInput ref={plantNameRef} type="text" placeholder="Plant name" value={plantInput.plantName} onChange={(e) => setPlantInput({...plantInput, plantName: e.target.value})}></PlantNameInput>
                <StyledPlantInfoInput>
                    <StyledPlantInfo>Water:</StyledPlantInfo>
                    <StyledSelect value={plantInput.water} onChange={(e) => setPlantInput({...plantInput, water: e.target.value})} selected={plantInput.water}>
                        <option value="Select an option" disabled>Select an option</option>
                        {waterOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </StyledSelect>
                </StyledPlantInfoInput>
                <StyledPlantInfoInput>
                    <StyledPlantInfo>Sunlight:</StyledPlantInfo>
                    <StyledSelect value={plantInput.sunlight} onChange={(e) => setPlantInput({...plantInput, sunlight: e.target.value})} selected={plantInput.sunlight}>
                        <option value="Select an option" disabled>Select an option</option>
                        {sunlightOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </StyledSelect>
                </StyledPlantInfoInput>
                <StyledPlantInfoInput>
                    <StyledPlantInfo>Fertilizer:</StyledPlantInfo>
                    <StyledSelect value={plantInput.fertilizer} onChange={(e) => setPlantInput({...plantInput, fertilizer: e.target.value})} selected={plantInput.fertilizer}>
                        <option value="Select an option" disabled>Select an option</option>
                        {fertilizerOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </StyledSelect>
                </StyledPlantInfoInput>
                <StyledPlantInfo>Note:</StyledPlantInfo>
                <StyledTextarea maxLength={246} value={plantInput.note} onChange={(e) => setPlantInput({...plantInput, note: e.target.value})}/>
                <MyButton text={'Save'} Icon={<SaveIcon fontSize="medium" />} width={'120px'} action={handleSave} />
                <StyledDelete>
                    <ClearIcon htmlColor="white" onClick={(e) => {
                            plantAdded(false)
                        }}/>
                </StyledDelete>
            </PlantWrapper>

    )
}