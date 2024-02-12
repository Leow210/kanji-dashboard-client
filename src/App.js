import React from 'react';
import KanjiList from './components/KanjiList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KanjiDetail from './components/KanjiDetail';
import { AuthProvider } from './context/AuthContext'
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoutes';
import RegisterForm from './components/RegisterForm';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import StudyListDetailPage from './components/StudyListDetailPage';
import PremadeListDetailPage from './components/PremadeListDetailPage';







const App = () => {
  return (
    <AuthProvider> {/* wrap entire router with the authprovider*/}
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} /> {/* Homepage is the default root */}
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/studylists/:studyListId" element={<StudyListDetailPage />} />
            <Route path="/kanji/:kanjiId" element={<KanjiDetail />} />
            <Route path="/premadelist/:listId" element={<PremadeListDetailPage />} />
            {/* Wrap protected routes with PrivateRoute */}
            <Route element={<PrivateRoute />}>
              <Route path="/kanjilist" element={<KanjiList />} />
              {/* Add more protected routes here */}
            </Route>
            {/* Define more public routes as needed */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
