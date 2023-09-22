/**
 * Created by : Tushar Arora
 */
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignUpForm from "./pages/SignUpForm";
import Login from "./pages/LoginForm";
import SecurityQuestion from "./pages/SecurityQuestion";
import ColumnarCipher from "./pages/ColumnarCipher";
import HomePage from "./pages/HomePage";
import Restaurants from "./pages/Restaurants";
import LogOut from "./pages/LogOut";
import LexChatbot from "./utils/LexChatbot";
import UploadFileToS3 from "./components/data_processing/UploadFileToS3";
import Visualization from "./components/visualization/Visualization";
import Polarityoffeedback from "./components/Polarity/Polarityoffeedback";
import ChatBot from "./utils/ChatBot";
import AccountDetails from "./utils/LoginContext";
import Profile from "./pages/Profile";
import Header from "./components/Header";

function App() {
  return (
    <div>
      <AccountDetails>
        <Router>
          <Header/>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/sign-up" element={<SignUpForm />} />
            <Route exact path="/login" element={<Login />} />
            <Route
              exact
              path="/securityQuestion"
              element={<SecurityQuestion />}
            />
            <Route exact path="/columnarCipher" element={<ColumnarCipher />} />
            <Route exact path="/restaurants" element={<Restaurants />} />
            <Route exact path="/log-out" element={<LogOut />} />
            <Route exact path='/upload-recipe' element={<UploadFileToS3 />} />
            <Route exact path='/visualization' element={<Visualization />} />
            <Route exact path='/polarity' element={<Polarityoffeedback />} />
          </Routes>
          <LexChatbot/>
        </Router>
      </AccountDetails>
    </div>
  );
}

export default App;
