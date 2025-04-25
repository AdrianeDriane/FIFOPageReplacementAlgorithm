import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Dock from './components/Dock';

export default function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Dock />
      </>
    </Router>
  );
}