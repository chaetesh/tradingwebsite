import Navbar from "./components/Navbar";
import Home from "./components/Home";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import About from "./components/About";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar></Navbar>

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
