import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Simulator from './Simulator';
import Home from './Home';
import Quiz from './Quiz';
import Flowchart from './Flowchart';

export default function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/flowchart" element={<Flowchart />} />
        </Routes>
    </Router>
  );
}