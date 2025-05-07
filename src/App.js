import './App.css';
import { Account } from './screens/Account';
import { AuthenticationPage } from './screens/AuthenticationPage';
import { GardenDetails } from './screens/GardenDetails';
import { LandingPage } from './screens/LandingScreen';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HashRouter } from 'react-router-dom';
import { PlantDetails } from './screens/PlantDetails';


function App() {
  return (
    <HashRouter>
        <Routes>
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/authentication' element={<AuthenticationPage/>}/>
            <Route path='/account' element={<Account/>}/>
            <Route path='/garden' element={<GardenDetails/>}/>
            <Route path='/plant' element={<PlantDetails/>}/>
        </Routes>
    </HashRouter>
  );
}

export default App;
