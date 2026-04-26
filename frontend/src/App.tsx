import { BrowserRouter, Routes, Route } from "react-router-dom";
import Health from "./pages/Health";
import State from "./pages/State";
import EarthquakeMap from "./pages/Map";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Health />} />
        <Route path="/state" element={<State />} />
        <Route path="/map" element={<EarthquakeMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
