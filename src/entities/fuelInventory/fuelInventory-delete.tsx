import { IFuelInventory } from '../../model/fuelInventory.model';
import GenericModal from '../../utils/Modal';
import { useDispatch } from 'react-redux';
import { deleteEntity } from './fuelInventory.reducer';

type FuelInventoryDeleteProps = {
    fuelInventory: IFuelInventory | null;
    refresh: () => void;
};

const FuelInventoryDelete: React.FC<FuelInventoryDeleteProps> = ({ fuelInventory, refresh }) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        if (fuelInventory && fuelInventory._id) {
            dispatch(deleteEntity(fuelInventory._id));
            refresh();
        }
    };

    if (!fuelInventory) return null;

    const hasStock = (fuelInventory.currentStock || 0) > 0;

    return (
        <GenericModal
            id="fuelInventoryDeleteModal"
            title="Confirmar Eliminación"
        >
            <div className="modal-body">
                <div className="text-center">
                    <i className="bi bi-trash" style={{ color: '#e93e3e', fontSize: '200px' }}></i>
                    <h5 className="mt-3">¿Estás seguro de que deseas eliminar este inventario?</h5>
                </div>

                <div className="alert alert-warning mt-3">
                    <h6 className="alert-heading">
                        <i className="bi bi-info-circle me-2"></i>
                        Información del Inventario a Eliminar
                    </h6>
                    <div className="row">
                        <div className="col-md-6">
                            <strong>Tipo:</strong> {fuelInventory.fuelType}<br />
                            <strong>Tanque:</strong> {fuelInventory.tanque || 'N/A'}
                        </div>
                        <div className="col-md-6">
                            <strong>Stock Actual:</strong> {fuelInventory.currentStock?.toLocaleString() || 0} L<br />
                            <strong>Estado:</strong> {fuelInventory.isActive ? 'Activo' : 'Inactivo'}
                        </div>
                    </div>
                </div>

                {hasStock && (
                    <div className="alert alert-danger">
                        <h6 className="alert-heading">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            ¡Advertencia!
                        </h6>
                        <p className="mb-0">
                            Este inventario tiene <strong>{fuelInventory.currentStock?.toLocaleString()} litros</strong> de
                            combustible. Al eliminarlo, esta información se perderá permanentemente.
                        </p>
                    </div>
                )}

                <div className="alert alert-info">
                    <h6 className="alert-heading">
                        <i className="bi bi-info-circle me-2"></i>
                        Importante
                    </h6>
                    <ul className="mb-0">
                        <li>Esta acción no se puede deshacer</li>
                        <li>El inventario se marcará como eliminado (soft delete)</li>
                        <li>Las solicitudes relacionadas mantendrán sus referencias</li>
                        {hasStock && <li><strong>Se perderá el registro del stock actual</strong></li>}
                    </ul>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-muted">
                        Escribe <strong>CONFIRMAR</strong> para proceder con la eliminación:
                    </p>
                    <input
                        type="text"
                        className="form-control text-center"
                        placeholder="Escribe CONFIRMAR aquí"
                        id="confirmDeleteInput"
                        style={{ maxWidth: '200px', margin: '0 auto' }}
                    />
                </div>
            </div>

            <div className="row g-3">
                <div className="col-md-12 text-center">
                    <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-dismiss="modal"
                        style={{ marginRight: '10px' }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        data-bs-dismiss="modal"
                        onClick={() => {
                            const confirmInput = document.getElementById('confirmDeleteInput') as HTMLInputElement;
                            if (confirmInput && confirmInput.value === 'CONFIRMAR') {
                                handleDelete();
                            } else {
                                alert('Por favor, escribe CONFIRMAR para proceder con la eliminación');
                            }
                        }}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </GenericModal>
    );
};

export default FuelInventoryDelete;