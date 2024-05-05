import Navbar from "./components/Navbar";
import Home from "./components/Home";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import About from "./components/About";
import Login from "./components/login/Login";
import Register from "./components/register/register";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar></Navbar>

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/register" element={<Register></Register>} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
