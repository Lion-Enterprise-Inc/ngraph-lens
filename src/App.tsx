import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CameraPage from './pages/CameraPage';
import ResultPage from './pages/ResultPage';
import MyPage from './pages/MyPage';
import LogDetailPage from './pages/LogDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/camera" element={<CameraPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/log/:uid" element={<LogDetailPage />} />
    </Routes>
  );
}

export default App;
