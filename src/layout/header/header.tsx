import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'bootstrap';
import { logout } from '../../entities/user/user.reducer';
import '../../App.css';

type HeaderProps = {
    onToggleSidebar: () => void;
    collapse: boolean;
};

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, collapse }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state: any) => state.user);
    const [sidebarWidth, setSidebarWidth] = useState('280px');
    
    // Actualizar el ancho del sidebar cuando cambia el estado de collapse o el tamaño de ventana
    useEffect(() => {
        const updateSidebarWidth = () => {
            if (window.innerWidth <= 768) {
                setSidebarWidth('0px'); // En móvil, el sidebar no afecta al header
            } else {
                setSidebarWidth(collapse ? '70px' : '280px'); // Colapsado vs expandido
            }
        };
        
        updateSidebarWidth();
        
        const handleResize = () => {
            updateSidebarWidth();
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [collapse]); // Se ejecuta cuando cambia el estado de collapse

    useEffect(() => {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            new Tooltip(tooltipTriggerEl);
        });
    }, []);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav
            className="app-header navbar navbar-expand bg-body shadow-sm"
            style={{
                position: 'fixed',
                top: 0,
                left: window.innerWidth >= 768 ? sidebarWidth : '0',
                width: window.innerWidth >= 768 ? `calc(100% - ${sidebarWidth})` : '100%',
                height: '60px',
                transition: 'width 0.3s ease, left 0.3s ease',
                zIndex: 1000
            }}
        >
            <div className="container-fluid px-3">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <button
                            className="nav-link btn btn-outline-light border-0"
                            onClick={onToggleSidebar}
                            data-lte-toggle="sidebar"
                            type="button"
                            aria-label="Toggle sidebar"
                        >
                            <i className="bi bi-list fs-5"></i>
                        </button>
                    </li>
                    <li className="nav-item d-none d-lg-block">
                        <a href="/#" className="nav-link" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Home">
                            <i className="bi bi-house-fill me-2"></i>Home
                        </a>
                    </li>
                    <li className="nav-item d-none d-lg-block">
                        <a href="/#" className="nav-link" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Contact">
                            <i className="bi bi-envelope-fill me-2"></i>Contact
                        </a>
                    </li>
                </ul>

                <ul className="navbar-nav ms-auto align-items-center">
                    {/* Fuel Alerts Bell - Hidden on small screens */}
                    
                    {/* User Profile Dropdown */}
                    <li className="nav-item dropdown">
                        <a 
                            className="nav-link d-flex align-items-center"
                            data-bs-toggle="dropdown"
                            href="/#"
                            aria-expanded="false"
                        >
                            <div className="d-flex align-items-center">
                                <img
                                    src="/synex.png"
                                    alt="User Avatar"
                                    className="rounded-circle me-2"
                                    width="32"
                                    height="32"
                                />
                                <div className="d-none d-sm-block">
                                    <div className="fw-medium text-truncate" style={{ maxWidth: '120px' }}>
                                        {user?.email?.split('@')[0] || 'Synex'}
                                    </div>
                                    <div className="text-muted small">
                                        {user?.role || 'Usuario'}
                                    </div>
                                </div>
                                <i className="bi bi-chevron-down ms-2 d-none d-sm-inline"></i>
                            </div>
                        </a>

                        <div className="dropdown-menu dropdown-menu-end shadow-sm">
                            <div className="dropdown-header d-sm-none">
                                <div className="d-flex align-items-center">
                                    <img
                                        src="/synex.png"
                                        alt="User Avatar"
                                        className="rounded-circle me-3"
                                        width="40"
                                        height="40"
                                    />
                                    <div>
                                        <div className="fw-medium">
                                            {user?.email?.split('@')[0] || 'Synex'}
                                        </div>
                                        <div className="text-muted small">
                                            {user?.role || 'Usuario'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown-divider d-sm-none"></div>
                            
                            <a className="dropdown-item d-flex align-items-center py-2" href="/#">
                                <i className="bi bi-person me-3"></i>
                                Perfil
                            </a>
                            <a className="dropdown-item d-flex align-items-center py-2" href="/#">
                                <i className="bi bi-gear me-3"></i>
                                Configuración
                            </a>
                            <div className="dropdown-divider"></div>
                            <button 
                                className="dropdown-item d-flex align-items-center py-2 text-danger"
                                onClick={handleLogout}
                                type="button"
                            >
                                <i className="bi bi-box-arrow-right me-3"></i>
                                Cerrar Sesión
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
