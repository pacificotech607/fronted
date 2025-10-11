import { IFuel } from '../../model/fuel.model';
import GenericModal from '../../utils/Modal';
import { useDispatch } from 'react-redux';
import { deleteEntity } from './fuel.reducer';
import { get } from 'lodash';

type FuelDeleteProps = {
  fuel: IFuel | null;
  refresh: () => void;
};

const FuelDelete: React.FC<FuelDeleteProps> = ({ fuel, refresh }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (fuel && fuel._id) {
      dispatch(deleteEntity(fuel._id));
      refresh();
    }
  };

  return (
    <GenericModal
      id="fuelDeleteModal"
      title="Eliminar registro de combustible"
    >
      <div className="card-body p-0 text-center">
        <i className="bi bi-trash" style={{ color: '#e93e3e', fontSize: '200px' }}></i>
        <p>¿Estás seguro de que deseas eliminar este registro de combustible del transporte {get(fuel?.transport, 'number', '')}?</p>
        <br />
        <div className="row g-3">
          <div className="col-md-12 text-center">
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" style={{ marginRight: '10px' }}>Cancelar</button>
            <button type="button" className="btn btn-danger" onClick={handleDelete} data-bs-dismiss="modal">Eliminar</button>
          </div>
        </div>
      </div>
    </GenericModal>
  );
};

export default FuelDelete;