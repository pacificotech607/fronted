import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IFuelInventory } from '../../model/fuelInventory.model';
import FuelInventoryModal from './fuelInventory-update';
import FuelInventoryDetail from './fuelInventory-detail';
import FuelInventoryDelete from './fuelInventory-delete';
import FuelInventoryStockUpdate from './fuelInventory-stock-update';
import FuelMovementHistory from './fuelMovement-history';
import { IRootState } from '../../model/root-state';
import { getEntities } from './fuelInventory.reducer';
import GenericMultiTagSearch from '../../utils/searchInput';

const FuelInventory: React.FC = () => {
    const dispatch = useDispatch();
    const fuelInventories = useSelector((state: IRootState) => state.fuelInventory.fuelInventories);
    const totalPages = useSelector((state: IRootState) => state.fuelInventory.totalPages);
    const activePage = useSelector((state: IRootState) => state.fuelInventory.page);
    const loading = useSelector((state: IRootState) => state.fuelInventory.loading);
    
    const [fuelInventory, setFuelInventory] = useState<IFuelInventory | null>(null);
    const [historyInventory, setHistoryInventory] = useState<IFuelInventory | null>(null);
    const [searchQuery, setSearchQuery] = useState<string | null>(
        JSON.stringify({ alive: true })
    );

    useEffect(() => {
        dispatch(getEntities(0, 20, searchQuery || undefined));
    }, [dispatch, searchQuery]);

    const handlePagination = (page: number) => {
        dispatch(getEntities(page, 20, searchQuery || undefined));
    };

    const handleSearch = (query: string | null) => {
        let finalQuery = JSON.stringify({ alive: true });
        
        if (query) {
            try {
                const userQuery = JSON.parse(query);
                finalQuery = JSON.stringify({ $and: [{ alive: true }, userQuery] });
            } catch (error) {
                console.error('Failed to parse search query:', error);
            }
        }
        
        setSearchQuery(finalQuery);
        dispatch(getEntities(0, 20, finalQuery));
    };

    const refresh = () => {
        dispatch(getEntities(0, 20, searchQuery || undefined));
    };

    const searchOptions = [
        { value: 'fuelType', label: 'Tipo de Combustible' },
        { value: 'tanque', label: 'Tanque' },
        { value: 'alertLevel', label: 'Nivel de Alerta' },
        { value: 'isActive', label: 'Activo' },
        { value: 'currentStock', label: 'Stock Actual' },
        { value: 'minimumLevel', label: 'Nivel Mínimo' },
        { value: 'maximumCapacity', label: 'Capacidad Máxima' },
    ];

    const getAlertBadgeClass = (alertLevel: string) => {
        switch (alertLevel) {
            case 'NORMAL': return 'badge bg-success';
            case 'LOW': return 'badge bg-warning';
            case 'CRITICAL': return 'badge bg-danger';
            case 'EMPTY': return 'badge bg-dark';
            default: return 'badge bg-secondary';
        }
    };

    const getAlertText = (alertLevel: string) => {
        switch (alertLevel) {
            case 'NORMAL': return 'Normal';
            case 'LOW': return 'Bajo';
            case 'CRITICAL': return 'Crítico';
            case 'EMPTY': return 'Vacío';
            default: return alertLevel;
        }
    };

    const calculatePercentage = (current: number, max: number) => {
        return max > 0 ? Math.round((current / max) * 100) : 0;
    };

    return (
        <div className="app-main">
            <div className="app-content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="mb-0">Inventario de Combustible</h3>
                        </div>
                        <div className="col-sm-6 text-end">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#fuelInventoryUpdateModal"
                                onClick={() => setFuelInventory(null)}
                            >
                                Crear Nuevo Inventario
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="app-content" style={{ margin: '10px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <GenericMultiTagSearch
                        searchOptions={searchOptions}
                        onSearchButtonClick={handleSearch}
                    />
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th style={{ width: '120px' }}>Acciones</th>
                                <th>Tipo Combustible</th>
                                <th>Tanque</th>
                                <th>Stock Actual</th>
                                <th>Nivel Mínimo</th>
                                <th>Capacidad Máxima</th>
                                <th>% Ocupación</th>
                                <th>Alerta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="text-center">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : fuelInventories && fuelInventories.length > 0 ? 
                                fuelInventories.map((inventory, i) => (
                                    <tr key={`entity-${i}`} className="align-middle">
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#fuelInventoryUpdateModal"
                                                    onClick={() => setFuelInventory(inventory)}
                                                    title="Editar"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-success btn-sm"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#fuelInventoryStockUpdateModal"
                                                    onClick={() => setFuelInventory(inventory)}
                                                    title="Cargar combustible"
                                                >
                                                    <i className="bi bi-fuel-pump"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-info btn-sm"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#fuelMovementHistoryModal"
                                                    onClick={() => setHistoryInventory(inventory)}
                                                    title="Ver historial de movimientos"
                                                >
                                                    <i className="bi bi-clock-history"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#fuelInventoryDetailModal"
                                                    onClick={() => setFuelInventory(inventory)}
                                                    title="Ver Detalles"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#fuelInventoryDeleteModal"
                                                    onClick={() => setFuelInventory(inventory)}
                                                    title="Eliminar"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <strong>{inventory.fuelType}</strong>
                                        </td>
                                        <td>{inventory.tanque || 'N/A'}</td>
                                        <td>
                                            <span className="fw-bold">{inventory.currentStock?.toLocaleString() || 0}L</span>
                                        </td>
                                        <td>{inventory.minimumLevel?.toLocaleString() || 0}L</td>
                                        <td>{inventory.maximumCapacity?.toLocaleString() || 0}L</td>
                                        <td>
                                            <div className="progress" style={{ height: '20px' }}>
                                                <div 
                                                    className="progress-bar" 
                                                    role="progressbar" 
                                                    style={{ 
                                                        width: `${calculatePercentage(inventory.currentStock || 0, inventory.maximumCapacity || 0)}%`,
                                                        backgroundColor: (inventory.alertLevel === 'CRITICAL' || inventory.alertLevel === 'EMPTY') ? '#dc3545' :
                                                                        inventory.alertLevel === 'LOW' ? '#ffc107' : '#198754'
                                                    }}
                                                >
                                                    {calculatePercentage(inventory.currentStock || 0, inventory.maximumCapacity || 0)}%
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={getAlertBadgeClass(inventory.alertLevel || 'NORMAL')}>
                                                {getAlertText(inventory.alertLevel || 'NORMAL')}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={10} className="text-center text-muted">
                                            No se encontraron inventarios de combustible
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="card-footer d-flex justify-content-center">
                    <nav aria-label="Page navigation">
                        <ul className="pagination">
                            <li className={`page-item ${activePage === 0 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => handlePagination(activePage - 1)} 
                                    disabled={activePage === 0}
                                >
                                    Anterior
                                </button>
                            </li>
                            {Array.from(Array(totalPages).keys()).map(i => (
                                <li key={i} className={`page-item ${activePage === i ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePagination(i)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${activePage === totalPages - 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => handlePagination(activePage + 1)} 
                                    disabled={activePage === totalPages - 1}
                                >
                                    Siguiente
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Modales */}
            <FuelInventoryModal fuelInventory={fuelInventory} refresh={refresh} />
            <FuelInventoryDetail fuelInventory={fuelInventory} />
            <FuelInventoryDelete fuelInventory={fuelInventory} refresh={refresh} />
            <FuelInventoryStockUpdate fuelInventory={fuelInventory} refresh={refresh} />
            
            {/* Historial de movimientos */}
            <FuelMovementHistory fuelInventory={historyInventory} />
        </div>
    );
};

export default FuelInventory;