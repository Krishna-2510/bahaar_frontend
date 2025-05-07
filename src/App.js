import './App.css';
import { Account } from './screens/Account';
import { AuthenticationPage } from './screens/AuthenticationPage';
import { GardenDetails } from './screens/GardenDetails';
import { LandingPage } from './screens/LandingScreen';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlantDetails } from './screens/PlantDetails';


function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='bahaar' element={<LandingPage/>}/>
            <Route path='bahaar/authentication' element={<AuthenticationPage/>}/>
            <Route path='bahaar/account' element={<Account/>}/>
            <Route path='bahaar/garden' element={<GardenDetails/>}/>
            <Route path='bahaar/plant' element={<PlantDetails/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
