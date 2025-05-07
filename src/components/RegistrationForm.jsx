import React, { useState } from "react";
import { Spacer, StyledAuthContainer, StyledAuthHeading, StyledAuthText, StyledSpan } from "../style/style";
import { InputBox } from "./InputBox";
import { MyButton } from "./MyButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../actions/userActions";
import loader from "../images/loader.svg"
import { apiendpoint } from "../utils/constantData";

export const RegistrationForm = ({toggleLogin}) => {
    const [fullName, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [apiResponse, setApiResponse] = useState({
        data:null,
        loading: false,
        error:false,
        message:''
    });
    const [showInitialText, setShowinitialtext] = useState(true);
    const [showWarning, setShowWarning] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleCheck = () => {
        setApiResponse({
            ...apiResponse,
            loading: false,
            error: false
        })
        if(email.trim() === '' || password.trim() === '' || fullName.trim() === ''){
            setShowWarning(true);
            return false;
        }
        else{
            setShowWarning(false);
            return true;
        }

    }

    const handleRegister = async() => {
        // console.log("Inside fn with data =", {'name': fullName, 'email':email , 'password': password});
        setShowinitialtext(false);
        if(handleCheck()){
            setApiResponse({
                ...apiResponse,
                loading: true
            })
            try{
                const response = await axios.post(`${apiendpoint}/register`, 
                {'name': fullName, 'email':email , 'password': password});
                // console.log("RES=", response);
                setApiResponse({
                    ...apiResponse,
                    loading: false,
                    error: false,
                    data: response.data.user,
                    message: response.data.message
                });
                dispatch(loginSuccess(response.data.user));
                sessionStorage.setItem('userName', response.data.user.name);
                sessionStorage.setItem('userId', response.data.user.id);
                setTimeout(loadLandingPage, 2000);
            }
            catch(e){
                // console.log("ERROR ", e);
                setApiResponse({
                    ...apiResponse,
                    loading: false,
                    error: true,
                    message: e.response.data.message
                })
            }
        }
    }

    const loadLandingPage = () => {
        navigate('/bahaar/account');
    }



    return(
        <StyledAuthContainer>
        <StyledAuthHeading>Register</StyledAuthHeading>
        {/* {apiResponse.loading && <StyledAuthText color="cyan">Loading...</StyledAuthText>} */}
        {apiResponse.loading && <img width={'40px'} src={loader}/>}
        {apiResponse.error && <StyledAuthText color="#ff3333">{apiResponse.message}</StyledAuthText>}
        {!apiResponse.loading && !apiResponse.error && <StyledAuthText color="#749F2A">{apiResponse.message}</StyledAuthText>}
        {showInitialText && <StyledAuthText color="#A5A5A5">Create your new account</StyledAuthText>}
        {showWarning && <StyledAuthText color="#d4c949">Please fill all the fields !</StyledAuthText>}
        <InputBox iconType={'person'} placeholder={'Enter your full name'} value={fullName} onChange={(e) => setFullname(e.target.value)}/>
        <InputBox iconType={'email'} placeholder={'Enter your email'} value={email} onChange={(e) => setEmail(e.target.value)}/>
        <InputBox iconType={'password'} placeholder={'Enter your password'} value={password} onChange={(e) => setPassword(e.target.value)}/>
        <Spacer/>
        <MyButton text="Sign up" action={() => handleRegister()}width={'200px'}/>
        <StyledAuthText color="#A5A5A5">Already have an account? <StyledSpan onClick={toggleLogin}>Sign In</StyledSpan></StyledAuthText>
        </StyledAuthContainer>
    )
}