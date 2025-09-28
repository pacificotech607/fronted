import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './layout/header/header';
import Sidebar from './layout/siderBar/sidebar';
import { useState } from 'react';
import Company from './entities/company/company';
import User from './entities/user/user';
import Operator from './entities/operator/operator';
import MotorTransport from './entities/motorTransport/motorTransport';
import Patio from './entities/patio/patio';
import Tab from './entities/tab/tab';
import SparePart from './entities/sparePart/sparePart';
import Valuelist from './entities/valuelist/valuelist';
import BLS from './entities/bls/bls';
import AssignPort from './modules/assignPort/assign-port';
import AssignTrips from './modules/assignTrips/assign-trips';
import PortExitReview from './modules/portexitreview/port-exit-review';
import ReturnPort from './modules/returnport/return-port';
import TripExitReview from './modules/tripexitreview/trip-exit-review';
import ReturnTrip from './modules/returntrip/return-trip';
import Invoice from './entities/invoice/invoice';
import Login from './modules/login/login';
import PrivateRoute from './utils/PrivateRoute';

interface MenuItem {
  label: string;
  icon?: string;
  href?: string;
  subMenus?: { label: string; href: string }[];
}

// Component to handle navigation after login
const AppContent = () => {
  const [collapse, setCollapse] = useState(false);

  const menuItems: MenuItem[] = [
    {
      label: 'User',
      icon: 'bi bi-people',
      href: '/user'
    },
    {
      label: 'Catalogos',
      icon: 'bi bi-archive',
      subMenus: [
        { label: 'BLs', href: '/bls' },
        { label: 'Empresas', href: '/company' },
        { label: 'Operadores', href: '/operator' },
        { label: 'Tabuladores', href: '/tab' },
        { label: 'Patios', href: '/patio' },
        { label: 'Autotransporte', href: '/motorTransport' },
        { label: 'Refacciones', href: '/sparePart' },
        { label: 'Valuelists', href: '/valuelist' }
      ]
    },
    {
      label: 'Asignar unidades a puerto',
      icon: 'bi bi-thunderbolt',
      href: '/assignPort'
    },
    {
      label: 'Asignar unidades a viaje',
      icon: 'bi bi-bus-front-fill',
      href: '/assignTrips'
    },
    {
      label: 'Unidades a puerto',
      icon: 'bi bi-truck',
      subMenus: [
        { label: 'Supervision de ida', href: '/portExitReview' },
        { label: 'Supervision de regreso', href: '/returnPort' }
      ]
    },
    {
      label: 'Unidades a viaje',
      icon: 'bi bi-truck-front-fill',
      subMenus: [
        { label: 'Supervision de ida', href: '/tripExitReview' },
        { label: 'Supervision de regreso', href: '/returnTrip' }
      ]
    },
    {
      label: 'Facturación',
      icon: 'bi bi-receipt-cutoff',
      subMenus: [
        { label: 'Factura', href: '/invoice' },
        { label: 'Nota de crédito', href: '/credit-note' },
      ]
    },
  ];
  const sidebarWidth = collapse ? '60px' : '235px';

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route
          path="/*"
          element={
            <>
              <Header onToggleSidebar={() => setCollapse(!collapse)} collapse={collapse} />
              <Sidebar collapse={collapse} menuItems={menuItems} />
              <main className="app-main" style={{ marginLeft: sidebarWidth, marginTop: '60px', transition: 'margin-left 0.3s ease' }}>
                <Routes>
                  <Route path="/user" element={<User />} />
                  <Route path="/company" element={<Company />} />
                  <Route path="/operator" element={<Operator />} />
                  <Route path="/motorTransport" element={<MotorTransport />} />
                  <Route path="/patio" element={<Patio />} />
                  <Route path="/tab" element={<Tab />} />
                  <Route path="/sparePart" element={<SparePart />} />
                  <Route path="/valuelist" element={<Valuelist />} />
                  <Route path="/bls" element={<BLS />} />
                  <Route path="/assignPort" element={<AssignPort />} />
                  <Route path="/assignTrips" element={<AssignTrips />} />
                  <Route path="/portExitReview" element={<PortExitReview />} />
                  <Route path="/returnPort" element={<ReturnPort />} />
                  <Route path="/tripExitReview" element={<TripExitReview />} />
                  <Route path="/returnTrip" element={<ReturnTrip />} />
                  <Route path="/invoice" element={<Invoice />} />
                  <Route path="/credit-note" element={<Invoice />} />
                </Routes>
              </main>
            </>
          }
        />
      </Route>
    </Routes>
  );
};

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
