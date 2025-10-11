import { useState, useEffect } from 'react';

export const useSidebar = () => {
  // Initialize collapse state from localStorage, with fallback to false
  const getInitialCollapseState = () => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      return JSON.parse(savedState);
    }
    // Default to false (expanded) for desktop, true (collapsed) for mobile
    return window.innerWidth <= 768;
  };

  const [collapse, setCollapse] = useState(getInitialCollapseState);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Function to toggle sidebar and save state to localStorage
  const toggleSidebar = () => {
    const newCollapseState = !collapse;
    setCollapse(newCollapseState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapseState));
  };

  // Initialize sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      const wasMobile = isMobile;
      setIsMobile(mobile);
      
      // Solo forzar collapsed cuando cambiamos de escritorio a móvil
      // Esto respeta el estado guardado en localStorage
      if (mobile && !wasMobile) {
        const newCollapseState = true;
        setCollapse(newCollapseState);
        localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapseState));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]); // Agregar isMobile como dependencia para detectar cambios

  const getSidebarWidth = () => {
    if (isMobile) {
      return collapse ? '0px' : '250px'; // En móvil: 0px colapsado, 250px expandido
    }
    return collapse ? '70px' : '280px'; // En escritorio: 70px colapsado, 280px expandido
  };

  const getMainMargin = () => {
    if (isMobile) {
      return '0px'; // En móvil, el contenido siempre toma el ancho completo (el sidebar se superpone)
    }
    return getSidebarWidth(); // En escritorio, el margen debe coincidir con el ancho del sidebar
  };

  return {
    collapse,
    isMobile,
    toggleSidebar,
    getSidebarWidth,
    getMainMargin
  };
};