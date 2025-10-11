import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContent from './components/AppContent';



// Main App component
function App() {
  return (
    <div>
      <ToastContainer />
      <Router>
        <AppContent />
      </Router>
    </div>
  );
}

export default App;
