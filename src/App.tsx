import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Dock from './components/Dock';
import About from './About';
import Quiz from './Quiz';
import Flowchart from './Flowchart';

export default function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/flowchart" element={<Flowchart />} />
        </Routes>
        <Dock />
      </>
    </Router>
  );
}