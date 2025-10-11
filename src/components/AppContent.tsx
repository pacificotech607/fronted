import { Routes, Route } from 'react-router-dom';
import Login from '../modules/login/login';
import PrivateRoute from '../utils/PrivateRoute';
import AppLayout from './AppLayout';

// Component to handle navigation after login
const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/*" element={<AppLayout />} />
      </Route>
    </Routes>
  );
};

export default AppContent;