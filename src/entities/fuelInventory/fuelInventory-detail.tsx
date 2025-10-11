import { IFuelInventory } from '../../model/fuelInventory.model';
import GenericModal from '../../utils/Modal';

type FuelInventoryDetailProps = {
    fuelInventory: IFuelInventory | null;
};

const FuelInventoryDetail: React.FC<FuelInventoryDetailProps> = ({ fuelInventory }) => {

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

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!fuelInventory) {
        return (
            <GenericModal
                id="fuelInventoryDetailModal"
                title="Detalles del Inventario de Combustible"
            >
                <div className="modal-body">
                    <div className="alert alert-warning mb-0">
                        No hay información de inventario de combustible disponible.
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                            Aceptar
                        </button>
                    </div>
                </div>
            </GenericModal>
        );
    }

    return (
        <GenericModal
            id="fuelInventoryDetailModal"
            title="Detalles del Inventario de Combustible"
        >
            <div className="modal-body">
                <div className="row g-3">
                    {/* Información General */}
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h6 className="card-title mb-0">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Información General
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <p><strong>Tipo de Combustible:</strong> {fuelInventory.fuelType}</p>
                                        <p><strong>Tanque:</strong> {fuelInventory.tanque || 'N/A'}</p>
                                        <p><strong>Estado:</strong> 
                                            <span className={fuelInventory.isActive ? 'badge bg-success ms-2' : 'badge bg-secondary ms-2'}>
                                                {fuelInventory.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Nivel de Alerta:</strong> 
                                            <span className={`${getAlertBadgeClass(fuelInventory.alertLevel || 'NORMAL')} ms-2`}>
                                                {getAlertText(fuelInventory.alertLevel || 'NORMAL')}
                                            </span>
                                        </p>
                                        <p><strong>Último Movimiento:</strong> {formatDate(fuelInventory.lastMovementDate)}</p>
                                        <p><strong>Disponible:</strong> 
                                            <span className={fuelInventory.alive ? 'text-success ms-2' : 'text-danger ms-2'}>
                                                {fuelInventory.alive ? 'Sí' : 'No'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información de Stock */}
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h6 className="card-title mb-0">
                                    <i className="bi bi-fuel-pump me-2"></i>
                                    Información de Stock
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="text-center">
                                            <h4 className="text-primary">{fuelInventory.currentStock?.toLocaleString() || 0}</h4>
                                            <p className="text-muted mb-0">Litros Actuales</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="text-center">
                                            <h4 className="text-warning">{fuelInventory.minimumLevel?.toLocaleString() || 0}</h4>
                                            <p className="text-muted mb-0">Nivel Mínimo</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="text-center">
                                            <h4 className="text-info">{fuelInventory.maximumCapacity?.toLocaleString() || 0}</h4>
                                            <p className="text-muted mb-0">Capacidad Máxima</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <hr />
                                
                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="form-label">Nivel de Ocupación</label>
                                        <div className="progress mb-2" style={{ height: '25px' }}>
                                            <div 
                                                className="progress-bar" 
                                                role="progressbar" 
                                                style={{ 
                                                    width: `${calculatePercentage(fuelInventory.currentStock || 0, fuelInventory.maximumCapacity || 0)}%`,
                                                    backgroundColor: (fuelInventory.alertLevel === 'CRITICAL' || fuelInventory.alertLevel === 'EMPTY') ? '#dc3545' :
                                                                    fuelInventory.alertLevel === 'LOW' ? '#ffc107' : '#198754'
                                                }}
                                            >
                                                {calculatePercentage(fuelInventory.currentStock || 0, fuelInventory.maximumCapacity || 0)}%
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <small className="text-muted">0L</small>
                                            <small className="text-muted">{fuelInventory.maximumCapacity?.toLocaleString() || 0}L</small>
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                <div className="row">
                                    <div className="col-md-6">
                                        <p><strong>Disponible para uso:</strong> 
                                            <span className="text-success ms-2">
                                                {Math.max(0, (fuelInventory.currentStock || 0) - (fuelInventory.minimumLevel || 0)).toLocaleString()}L
                                            </span>
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Espacio libre:</strong> 
                                            <span className="text-info ms-2">
                                                {Math.max(0, (fuelInventory.maximumCapacity || 0) - (fuelInventory.currentStock || 0)).toLocaleString()}L
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información de Auditoría */}
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h6 className="card-title mb-0">
                                    <i className="bi bi-clock-history me-2"></i>
                                    Información de Auditoría
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <p><strong>Creado:</strong> {formatDate(fuelInventory.createdAt)}</p>
                                        <p><strong>Creado por:</strong> {fuelInventory.createdBy || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Actualizado:</strong> {formatDate(fuelInventory.updatedAt)}</p>
                                        <p><strong>Actualizado por:</strong> {fuelInventory.updatedBy || 'N/A'}</p>
                                    </div>
                                </div>
                                {fuelInventory._id && (
                                    <div className="row">
                                        <div className="col-md-12">
                                            <p><strong>ID:</strong> <code>{fuelInventory._id}</code></p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                        Aceptar
                    </button>
                </div>
            </div>
        </GenericModal>
    );
};

export default FuelInventoryDetail;