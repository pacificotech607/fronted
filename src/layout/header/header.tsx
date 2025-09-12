import React, { useEffect } from 'react';
import { Tooltip } from 'bootstrap';
import '../../App.css';

type HeaderProps = {
    onToggleSidebar: () => void;
    collapse: boolean;
};

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, collapse }) => {
    const sidebarWidth = collapse ? '60px' : '235px';

    useEffect(() => {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            new Tooltip(tooltipTriggerEl);
        });
    }, []);

    return (
        <nav
            className="app-header navbar navbar-expand bg-body"
            style={{
                position: 'fixed',
                top: 0,
                left: sidebarWidth,
                width: `calc(100% - ${sidebarWidth})`,
                height: '60px',
                transition: 'width 0.3s ease, left 0.3s ease',
                zIndex: 999
            }}
        >
            <div className="container-fluid">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <button
                            className="nav-link"
                            onClick={onToggleSidebar}
                            data-lte-toggle="sidebar"
                            type="button"
                        >
                            <i className="bi bi-list"></i>
                        </button>
                    </li>
                    <li className="nav-item d-none d-md-block">
                        <a href="/#" className="nav-link" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Home">Home</a>
                    </li>
                    <li className="nav-item d-none d-md-block">
                        <a href="/#" className="nav-link" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Contact">Contact</a>
                    </li>
                </ul>

                <ul className="navbar-nav ms-auto" >
                    <i className="bi bi-bell-fill" style={{marginRight: '15px', marginTop:'15px'}}></i>
                    <li className="nav-item dropdown">
                        <a className="nav-link" data-bs-toggle="dropdown" href="/#">
                            <span className="navbar-badge badge text-bg-warning">15</span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                            <span className="dropdown-item dropdown-header">15 Notifications</span>
                            <div className="dropdown-divider"></div>
                            <a href="/#" className="dropdown-item">
                                <i className="bi bi-envelope me-2"></i> 4 new messages
                                <span className="float-end text-secondary fs-7">3 mins</span>
                            </a>
                            <div className="dropdown-divider"></div>
                            <a href="/#" className="dropdown-item">
                                <i className="bi bi-people-fill me-2"></i> 8 friend requests
                                <span className="float-end text-secondary fs-7">12 hours</span>
                            </a>
                            <div className="dropdown-divider"></div>
                            <a href="/#" className="dropdown-item">
                                <i className="bi bi-file-earmark-fill me-2"></i> 3 new reports
                                <span className="float-end text-secondary fs-7">2 days</span>
                            </a>
                            <div className="dropdown-divider"></div>
                            <a href="/#" className="dropdown-item dropdown-footer">
                                See All Notifications
                            </a>
                        </div>
                    </li>
                    <li className="nav-item dropdown user-menu">
                        <a href="/#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                            <img
                                src={"/synex.png"}
                                alt="Synex"
                                width={"25px"}
                                height={"25px"}
                            />
                            <span className="d-none d-md-inline">Synex</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                            <li className="user-header text-bg-primary">
                                <img
                                    src={"/synex.png"}
                                    className=""
                                    alt="Synex"
                                />
                                <p>synex
                                    <small>Member since Nov. 2023</small>
                                </p>
                            </li>
                            <li className="user-footer">
                                <a href="/#" className="btn btn-default btn-flat">Profile</a>
                                <a href="/#" className="btn btn-default btn-flat float-end">Sign out</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
