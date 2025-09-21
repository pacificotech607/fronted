import React, { useState } from 'react';
import '../../App.css';

interface MenuItem {
    label: string;
    href?: string;
    icon?: string;
    subMenus?: MenuItem[];
}

interface SidebarProps {
    collapse: boolean;
    menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ collapse, menuItems }) => {
    const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});

    const toggleSubMenu = (index: number) => {
        setOpenMenus((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const sidebarStyle: React.CSSProperties = {
        width: collapse ? '60px' : '235px',
        transition: 'width 0.3s ease, transform 0.3s ease',
        overflow: 'hidden',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        background: '#4A90E2'
    };

    const responsiveStyle: React.CSSProperties = {
        transform: collapse ? 'translateX(-100%)' : 'translateX(0)',
    };

    return (
        <aside
            style={{
                ...sidebarStyle,
                ...(window.innerWidth <= 768 ? responsiveStyle : {})
            }}
        >
            <div
                className="brand d-flex align-items-center justify-content-center"
                style={{
                    height: '60px',
                    padding: '0.5rem',
                    transition: 'all 0.3s ease',
                    background: '#4A90E2'
                }}
            >
                <a href="/index.html" className="d-flex align-items-center" style={{ textDecoration: 'none' }}>
                    <img
                        src={"/synex.png"}
                        alt="Synex"
                        className="brand-image opacity-75 shadow"
                        style={{
                            width: '30px',
                            transition: 'width 0.3s ease'
                        }}
                    />
                    {!collapse && <span className="brand-text">Synex</span>}
                </a>
            </div>
            <ul className="list-unstyled">
                {menuItems.map((item, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }} title={item.label}>
                        <div
                            onClick={() => item.subMenus && toggleSubMenu(index)}
                            style={{
                                cursor: item.subMenus ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: collapse ? 'center' : 'flex-start',
                                padding: '0.5rem',
                                backgroundColor: 'none',
                                borderRadius: '4px',
                                transition: 'background-color 0.2s ease'
                            }}
                        >
                            {item.icon && <i className={`me-2 ${item.icon}`}  style={{ color: '#fff' }} />}
                            {!collapse && (
                                <a
                                    href={item.href || '#'}
                                    style={{
                                        textDecoration: 'none',
                                        color: '#fff',
                                        flexGrow: 1
                                    }}
                                >
                                    {item.label}
                                </a>
                            )}
                            {item.subMenus && !collapse && (
                                <span style={{ marginLeft: 'auto', color: '#fff' }}>
                                    {openMenus[index] ? '▲' : '▼'}
                                </span>
                            )}
                        </div>

                        {/* Submenú */}
                        {item.subMenus && openMenus[index] && !collapse && (
                            <ul className="list-unstyled" style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
                                {item.subMenus.map((subItem, subIndex) => (
                                    <li key={subIndex} style={{ marginBottom: '0.25rem' }}>
                                        <a
                                            href={subItem.href || '#'}
                                            title={subItem.label}
                                            style={{
                                                textDecoration: 'none',
                                                color: '#fff',
                                                padding: '0.4rem',
                                                display: 'block',
                                                borderRadius: '4px',
                                                backgroundColor: 'none'
                                            }}
                                        >
                                            {subItem.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;
