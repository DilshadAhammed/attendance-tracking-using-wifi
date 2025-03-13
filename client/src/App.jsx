import RegistrationForm from "./pages/RegistrationForm";
import Attendance from "./pages/Attendence";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/attendence" element={<Attendance />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
