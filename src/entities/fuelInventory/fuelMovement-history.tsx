import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IFuelInventory } from '../../model/fuelInventory.model';
import GenericModal from '../../utils/Modal';

interface IFuelMovement {
    _id: string;
    inventoryId: string;
    movementType: 'entrada' | 'salida';
    quantity: number;
    reason: string;
    previousStock: number;
    newStock: number;
    performedBy: string;
    movementDate: string;
    createdAt: string;
    updatedAt: string;
}

interface FuelMovementHistoryProps {
    fuelInventory: IFuelInventory | null;
}

const FuelMovementHistory: React.FC<FuelMovementHistoryProps> = ({ fuelInventory }) => {
    const [movements, setMovements] = useState<IFuelMovement[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [stats, setStats] = useState<any>(null);

    const fetchMovements = async (pageNum: number = 0) => {
        if (!fuelInventory?._id) return;

        setLoading(true);
        try {
            const response = await axios.get(
                `/api/fuel-movements/inventory/${fuelInventory._id}/history?page=${pageNum}&size=10`
            );

            if (response.data.success) {
                setMovements(response.data.data.docs);
                setTotalPages(response.data.pagination.totalPages);
                setTotalElements(response.data.pagination.totalElements);
                setPage(pageNum);
            }
        } catch (error: any) {
            console.error('Error loading movement history:', error);
            toast.error('Error al cargar el historial de movimientos');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        if (!fuelInventory?._id) return;

        try {
            const response = await axios.get(
                `/api/fuel-movements/inventory/${fuelInventory._id}/stats`
            );

            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error: any) {
            console.error('Error loading movement stats:', error);
        }
    };

    useEffect(() => {
        if (fuelInventory?._id) {
            fetchMovements(0);
            fetchStats();
        }
    }, [fuelInventory?._id]); // eslint-disable-line react-hooks/exhaustive-deps

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMovementBadge = (type: string) => {
        return type === 'entrada' 
            ? 'badge bg-success' 
            : 'badge bg-danger';
    };

    return (
        <GenericModal
            id="fuelMovementHistoryModal"
            title={`Historial de Movimientos - ${fuelInventory?.fuelType || ''} (${fuelInventory?.tanque || ''})`}
            size="xl"
        >
            <div className="form-container">
                {/* Estadísticas */}
                {stats && (
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="card border-success">
                                <div className="card-body text-center">
                                    <h5 className="card-title text-success">
                                        <i className="bi bi-arrow-up-circle-fill me-2"></i>
                                        Entradas
                                    </h5>
                                    <h3 className="text-success">{stats.entradas.count}</h3>
                                    <p className="card-text">
                                        <strong>{stats.entradas.totalQuantity.toLocaleString()} L</strong><br/>
                                        <small className="text-muted">
                                            Promedio: {stats.entradas.avgQuantity.toLocaleString()} L
                                        </small>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-danger">
                                <div className="card-body text-center">
                                    <h5 className="card-title text-danger">
                                        <i className="bi bi-arrow-down-circle-fill me-2"></i>
                                        Salidas
                                    </h5>
                                    <h3 className="text-danger">{stats.salidas.count}</h3>
                                    <p className="card-text">
                                        <strong>{stats.salidas.totalQuantity.toLocaleString()} L</strong><br/>
                                        <small className="text-muted">
                                            Promedio: {stats.salidas.avgQuantity.toLocaleString()} L
                                        </small>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-info">
                                <div className="card-body text-center">
                                    <h5 className="card-title text-info">
                                        <i className="bi bi-fuel-pump me-2"></i>
                                        Stock Actual
                                    </h5>
                                    <h3 className="text-info">{fuelInventory?.currentStock?.toLocaleString()} L</h3>
                                    <p className="card-text">
                                        <strong>Capacidad: {fuelInventory?.maximumCapacity?.toLocaleString()} L</strong><br/>
                                        <small className="text-muted">
                                            Ocupación: {Math.round(((fuelInventory?.currentStock || 0) / (fuelInventory?.maximumCapacity || 1)) * 100)}%
                                        </small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabla de movimientos */}
                <div className="table-responsive">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : movements.length === 0 ? (
                        <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            No hay movimientos registrados para este inventario.
                        </div>
                    ) : (
                                        <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Tipo</th>
                                    <th>Cantidad</th>
                                    <th>Stock Anterior</th>
                                    <th>Stock Nuevo</th>
                                    <th>Razón</th>
                                    <th>Usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movements.map((movement) => (
                                    <tr key={movement._id}>
                                        <td>
                                            <small>{formatDate(movement.movementDate)}</small>
                                        </td>
                                        <td>
                                            <span className={getMovementBadge(movement.movementType)}>
                                                <i className={movement.movementType === 'entrada' ? 'bi bi-arrow-up-circle-fill' : 'bi bi-arrow-down-circle-fill'}></i>
                                                {' ' + movement.movementType.charAt(0).toUpperCase() + movement.movementType.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={movement.movementType === 'entrada' ? 'text-success' : 'text-danger'}>
                                                {movement.movementType === 'entrada' ? '+' : '-'}{movement.quantity.toLocaleString()} L
                                            </span>
                                        </td>
                                        <td>{movement.previousStock.toLocaleString()} L</td>
                                        <td>
                                            <strong>{movement.newStock.toLocaleString()} L</strong>
                                        </td>
                                        <td>
                                            <span className="text-muted" title={movement.reason}>
                                                {movement.reason.length > 50 
                                                    ? movement.reason.substring(0, 50) + '...' 
                                                    : movement.reason}
                                            </span>
                                        </td>
                                        <td>
                                            <small className="text-muted">{movement.performedBy}</small>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    )}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                    <nav aria-label="Historial pagination">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => fetchMovements(page - 1)}
                                    disabled={page === 0 || loading}
                                >
                                    Anterior
                                </button>
                            </li>
                            
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const pageNum = Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
                                return (
                                    <li key={pageNum} className={`page-item ${page === pageNum ? 'active' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => fetchMovements(pageNum)}
                                            disabled={loading}
                                        >
                                            {pageNum + 1}
                                        </button>
                                    </li>
                                );
                            })}
                            
                            <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => fetchMovements(page + 1)}
                                    disabled={page >= totalPages - 1 || loading}
                                >
                                    Siguiente
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}

                {/* Info de paginación */}
                {totalElements > 0 && (
                    <div className="text-center mt-3">
                        <small className="text-muted">
                            Mostrando {Math.min(10, totalElements - (page * 10))} de {totalElements} movimientos
                        </small>
                    </div>
                )}
            </div>
        </GenericModal>
    );
};

export default FuelMovementHistory;