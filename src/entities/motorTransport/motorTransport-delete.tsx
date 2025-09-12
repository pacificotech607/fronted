import { IMotorTransport } from '../../model/motorTransport.model';
import GenericModal from '../../utils/Modal';
import { useDispatch } from 'react-redux';
import { deleteEntity } from './motorTransport.reducer';

type MotorTransportDeleteProps = {
  motorTransport: IMotorTransport | null;
  refresh: () => void;
};

const MotorTransportDelete: React.FC<MotorTransportDeleteProps> = ({ motorTransport, refresh }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (motorTransport && motorTransport._id) {
      dispatch(deleteEntity(motorTransport._id));
      refresh();
    }
  };

  return (
    <GenericModal
      id="motorTransportDeleteModal"
      title="Eliminar autotransporte"
    >
      <div className="card-body p-0 text-center">
        <i className="bi bi-trash" style={{ color: '#e93e3e', fontSize: '200px' }}></i>
        <p>¿Estás seguro de que deseas eliminar este autotransporte {motorTransport?.number}?</p>
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

export default MotorTransportDelete;
