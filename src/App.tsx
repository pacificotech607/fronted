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





interface MenuItem {
  label: string;
  icon?: string;
  href?: string;
  subMenus?: { label: string; href: string }[];
}

function App() {
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
        { label: 'BLs', href: '/index.html' },
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
      label: 'Unidades a puerto',
      icon: 'bi bi-truck',
      subMenus: [
        { label: 'Supervision de ida', href: '/index.html' },
        { label: 'Supervision de regreso', href: '/index2.html' }
      ]
    },
            {
      label: 'Unidades a viaje',
      icon: 'bi bi-truck-front-fill',
      subMenus: [
        { label: 'Supervision de ida', href: '/index.html' },
        { label: 'Supervision de regreso', href: '/index2.html' }
      ]
    },
  ];
  const sidebarWidth = collapse ? '60px' : '235px';

  return (
    <div>
      <ToastContainer />
      <Header onToggleSidebar={() => setCollapse(!collapse)} collapse={collapse} />
      <Sidebar collapse={collapse} menuItems={menuItems} />
      <main className="app-main" style={{ marginLeft: sidebarWidth, marginTop: '60px', transition: 'margin-left 0.3s ease' }}>
        <Router>
          <Routes>
            <Route path="/user" element={<User />} />
            <Route path="/company" element={<Company />} />
            <Route path="/operator" element={<Operator />} />
            <Route path="/motorTransport" element={<MotorTransport />} />
            <Route path="/patio" element={<Patio />} />
            <Route path="/tab" element={<Tab />} />
            <Route path="/sparePart" element={<SparePart />} />
            <Route path="/valuelist" element={<Valuelist />} />
            {/* Más rutas públicas */}
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;
