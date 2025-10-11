export interface IFuelInventory {
  _id?: string;
  fuelType: string; // 'Diesel', 'Gasolina', 'Gas Natural'
  currentStock: number; // Litros disponibles
  minimumLevel: number; // Nivel mínimo de alerta
  maximumCapacity: number; // Capacidad máxima del tanque
  tanque?: string; // Nombre del tanque
  lastMovementDate?: string; // Fecha del último movimiento
  alertLevel?: 'NORMAL' | 'LOW' | 'CRITICAL' | 'EMPTY'; // Nivel de alerta
  isActive?: boolean; // Si el inventario está activo
  alive?: boolean; // Para soft delete
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface IFuelInventoryStockUpdate {
  quantity: number;
  operation: 'ADD' | 'SUBTRACT';
  reason?: string;
  updatedBy?: string;
}

export interface IFuelInventoryAvailability {
  available: boolean;
  message: string;
  currentStock: number;
  requiredQuantity?: number;
  remainingAfter?: number;
}

export interface IFuelInventorySummary {
  totalInventories: number;
  totalStock: number;
  totalCapacity: number;
  lowStockCount: number;
  criticalStockCount: number;
  emptyStockCount: number;
}

export const FUEL_TYPES = [
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Gasolina', label: 'Gasolina' },
  { value: 'Gas Natural', label: 'Gas Natural' }
] as const;

export const ALERT_LEVELS = [
  { value: 'NORMAL', label: 'Normal', color: 'success' },
  { value: 'LOW', label: 'Bajo', color: 'warning' },
  { value: 'CRITICAL', label: 'Crítico', color: 'danger' },
  { value: 'EMPTY', label: 'Vacío', color: 'dark' }
] as const;