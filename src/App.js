import ProfilePage from "./components/ProfilePage";
import AdditionPage from "./components/AdditionPage";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    
  } from "react-router-dom";
import NavBar from "./components/NavBar";
import ThirdPartyComponent from "./components/ThirdPartyComponent";
import InventoryList from "./components/InventoryPage";
import AddInventoryItem from "./components/AddInventoryItem";
import UpdateInventoryItem from "./components/UpdateInventoryItem";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import UserInfo from "./components/UserInfo";

function App() {
    return (
        <Router>
            <div style={{ height: "100vh", width: "100vw" }}>
                <NavBar />
                <Routes>
                    <Route path="/additionPage" element={<AdditionPage />}></Route>
                    <Route path="/" element={<ProfilePage />}></Route>
                    <Route path="/third-party-api" element={<ThirdPartyComponent />}></Route>
                    <Route path="/inventorypage" element={<InventoryList />}></Route>
                    <Route path="/add-item" element={<AddInventoryItem />}></Route>
                    <Route path="/update-item/:id" element={<UpdateInventoryItem />}></Route>
                    <Route path="/signup" element={<SignUp />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/userinfo/:id" element={<UserInfo />}></Route>
                </Routes>
            </div>
        </Router>
    )
}

export default App;
