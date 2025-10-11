import { MenuItem } from '../types/menu.types';

export const menuItems: MenuItem[] = [
  {
    label: 'Home',
    icon: 'bi bi-house-door',
    href: '/home'
  },
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
    label: 'Combustible',
    icon: 'bi bi-fuel-pump',
    subMenus: [
      { label: 'Carga combustible', href: '/fuel' },
      { label: 'Inventario de combustible', href: '/fuelInventory' },
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