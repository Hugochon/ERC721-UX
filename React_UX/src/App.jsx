import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChainInfo from "./pages/ChainInfo";
import FakeBAYC from "./pages/FakeBAYC";
import FakeNefturians from "./pages/FakeNefturians";
import FakeMeebits from "./pages/FakeMeebits";
import "./App.css"

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/chain-info">Chain Info</a>
          </li>
          <li>
            <a href="/fakeBayc">Fake Bayc</a>
          </li>
          <li>
            <a href="/fakeNefturians">Fake Nefturians</a>
          </li>
          <li>
            <a href="/fakeMeebits">Fake Meebits</a>
          </li>
        </ul>
      </nav>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chain-info" element={<ChainInfo />} />
          <Route path="/fakeBayc" element={<FakeBAYC />} />
          <Route path="/fakeNefturians" element={<FakeNefturians />} />
          <Route path="/fakeMeebits" element={<FakeMeebits />} />
        </Routes>
      
      </Router>
    </div>
  );
}
export default App;