import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [activePopover, setActivePopover] = useState<number | null>(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (activePopover !== null && collapse && !isMobile) {
                const target = event.target as Element;
                const popover = document.querySelector('[data-popover="true"]');
                const sidebar = document.querySelector('aside');
                
                if (popover && !popover.contains(target) && sidebar && !sidebar.contains(target)) {
                    setActivePopover(null);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousedown', handleClickOutside);
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
        };
    }, [activePopover, collapse, isMobile, hideTimeout]);

    const toggleSubMenu = (index: number) => {
        setOpenMenus(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleItemClick = (item: MenuItem, index: number, event: React.MouseEvent) => {
        if (collapse && !isMobile && item.subMenus) {
            if (activePopover === index) {
                setActivePopover(null);
            } else {
                handleMouseEnter(item, index, event);
            }
        } else if (item.subMenus) {
            toggleSubMenu(index);
        } else if (item.href) {
            window.location.href = item.href;
        }
    };

    const handleMouseEnter = (item: MenuItem, index: number, event: React.MouseEvent) => {
        (event.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)';
        
        if (collapse && !isMobile && item.subMenus && item.subMenus.length > 0) {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                setHideTimeout(null);
            }
            
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            const popoverWidth = 220;
            let left = rect.right + 15;
            
            if (left + popoverWidth > window.innerWidth) {
                left = rect.left - popoverWidth - 15;
            }
            
            setPopoverPosition({
                top: rect.top,
                left: Math.max(15, left)
            });
            setActivePopover(index);
        }
    };
    
    const handleMouseLeave = (event: React.MouseEvent) => {
        (event.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
        
        if (collapse && !isMobile) {
            const timeout = setTimeout(() => {
                setActivePopover(null);
            }, 300);
            setHideTimeout(timeout);
        }
    };

    const handlePopoverMouseEnter = () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            setHideTimeout(null);
        }
    };

    const handlePopoverMouseLeave = () => {
        setActivePopover(null);
    };

    return (
        <>
            <aside 
                className={`sidebar ${collapse ? 'collapsed' : 'expanded'}`}
                style={{
                    width: collapse ? (isMobile ? '0' : '70px') : (isMobile ? '250px' : '280px'),
                    height: '100vh',
                    backgroundColor: '#4A90E2',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    transition: 'width 0.3s ease',
                    zIndex: 1000,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{ 
                    padding: '1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <a href="/#" className="d-flex align-items-center" style={{ textDecoration: 'none' }}>
                        <img
                            src={"/synex.png"}
                            alt="Synex"
                            className="brand-image opacity-75 shadow"
                            style={{
                                width: '30px',
                                transition: 'width 0.3s ease'
                            }}
                        />
                        {(!collapse || isMobile) && (
                            <span 
                                className="brand-text fw-bold ms-2" 
                                style={{ 
                                    color: '#fff',
                                    fontSize: '1.2rem',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Synex
                            </span>
                        )}
                    </a>
                </div>

                <div className="sidebar-nav" style={{ padding: '1rem 0.5rem', height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
                    <ul className="list-unstyled mb-0">
                        {menuItems.map((item, index) => (
                            <li key={index} className="nav-item" style={{ marginBottom: '0.25rem' }}>
                                <div
                                    className={`nav-link d-flex align-items-center cursor-pointer`}
                                    style={{
                                        color: '#fff',
                                        padding: collapse && !isMobile ? '1rem' : '0.75rem 1rem',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s ease',
                                        backgroundColor: 'transparent',
                                        minHeight: '48px',
                                        justifyContent: collapse && !isMobile ? 'center' : 'flex-start'
                                    }}
                                    onClick={(e) => handleItemClick(item, index, e)}
                                    onMouseEnter={(e) => handleMouseEnter(item, index, e)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {item.icon && (
                                        <i 
                                            className={`${item.icon} ${!collapse || isMobile ? 'me-3' : ''}`}
                                            style={{ 
                                                fontSize: '1.2rem',
                                                minWidth: '20px',
                                                color: '#fff'
                                            }}
                                        />
                                    )}
                                    {(!collapse || isMobile) && (
                                        <>
                                            {item.href && !item.subMenus ? (
                                                <a
                                                    href={item.href}
                                                    className="flex-grow-1 text-decoration-none"
                                                    style={{
                                                        color: '#fff',
                                                        fontSize: '0.95rem',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    {item.label}
                                                </a>
                                            ) : (
                                                <span
                                                    className="flex-grow-1"
                                                    style={{
                                                        color: '#fff',
                                                        fontSize: '0.95rem',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    {item.label}
                                                </span>
                                            )}
                                            {item.subMenus && (
                                                <i 
                                                    className={`bi ${openMenus[index] ? 'bi-chevron-up' : 'bi-chevron-down'}`}
                                                    style={{ 
                                                        color: '#fff', 
                                                        fontSize: '0.8rem',
                                                        transition: 'transform 0.2s ease'
                                                    }}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>

                                {item.subMenus && openMenus[index] && (!collapse || isMobile) && (
                                    <ul className="list-unstyled submenu" style={{ 
                                        paddingLeft: '3rem', 
                                        marginTop: '0.5rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {item.subMenus.map((subItem, subIndex) => (
                                            <li key={subIndex} className="nav-item" style={{ marginBottom: '0.25rem' }}>
                                                <a
                                                    href={subItem.href || '#'}
                                                    className="nav-link submenu-link"
                                                    style={{
                                                        color: 'rgba(255,255,255,0.8)',
                                                        fontSize: '0.85rem',
                                                        padding: '0.5rem 1rem',
                                                        textDecoration: 'none',
                                                        borderRadius: '5px',
                                                        borderLeft: '3px solid transparent',
                                                        transition: 'all 0.2s ease',
                                                        display: 'block'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                                        e.currentTarget.style.color = '#fff';
                                                        e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.5)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                        e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                                                        e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.3)';
                                                    }}
                                                    title={subItem.label}
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
                </div>
            </aside>

            {/* TODOS LOS POPOVERS USANDO PORTAL - SE RENDERIZAN FUERA DEL SIDEBAR */}
            {createPortal(
                <>
                    {/* POPOVER HOVER - FUERA DEL SIDEBAR */}
                    {activePopover !== null && collapse && !isMobile && menuItems[activePopover]?.subMenus && (
                        <div
                            data-popover="true"
                            style={{
                                position: 'fixed',
                                top: `${popoverPosition.top}px`,
                                left: `${popoverPosition.left}px`,
                                backgroundColor: '#4A90E2',
                                borderRadius: '12px',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                                zIndex: 99999,
                                minWidth: '220px',
                                border: '2px solid rgba(255,255,255,0.2)',
                                maxHeight: '350px',
                                overflowY: 'auto',
                                opacity: 1,
                                transform: 'translateY(0)',
                                transition: 'all 0.2s ease-in-out'
                            }}
                            onMouseEnter={handlePopoverMouseEnter}
                            onMouseLeave={handlePopoverMouseLeave}
                        >
                            {/* Header del popover */}
                            {activePopover !== null && menuItems[activePopover] && (
                                <div
                                    style={{
                                        padding: '12px 16px',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {menuItems[activePopover].icon && (
                                        <i 
                                            className={`${menuItems[activePopover].icon} me-2`} 
                                            style={{ color: '#fff', fontSize: '1rem' }} 
                                        />
                                    )}
                                    {menuItems[activePopover].label}
                                </div>
                            )}

                            {/* Lista de submenús */}
                            <div style={{ padding: '8px' }}>
                                {activePopover !== null && menuItems[activePopover]?.subMenus?.map((subItem: MenuItem, subIndex: number) => (
                                    <a
                                        key={subIndex}
                                        href={subItem.href || '#'}
                                        style={{
                                            display: 'block',
                                            padding: '10px 12px',
                                            color: 'rgba(255,255,255,0.9)',
                                            textDecoration: 'none',
                                            borderRadius: '6px',
                                            transition: 'all 0.2s ease',
                                            fontSize: '0.9rem',
                                            marginBottom: '2px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                            e.currentTarget.style.color = '#fff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                                        }}
                                    >
                                        {subItem.icon && (
                                            <i className={`${subItem.icon} me-2`} style={{ fontSize: '0.8rem' }} />
                                        )}
                                        {subItem.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </>,
                document.body
            )}
        </>
    );
};

export default Sidebar;