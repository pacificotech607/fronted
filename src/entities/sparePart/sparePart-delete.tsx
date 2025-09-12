import { ISparePart } from '../../model/sparePart.model';
import GenericModal from '../../utils/Modal';
import { useDispatch } from 'react-redux';
import { deleteEntity } from './sparePart.reducer';

type SparePartDeleteProps = {
  sparePart: ISparePart | null;
  refresh: () => void;
};

const SparePartDelete: React.FC<SparePartDeleteProps> = ({ sparePart, refresh }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (sparePart && sparePart._id) {
      dispatch(deleteEntity(sparePart._id));
      refresh();
    }
  };

  return (
    <GenericModal
      id="sparePartDeleteModal"
      title="Eliminar refacción"
    >
      <div className="card-body p-0 text-center">
        <i className="bi bi-trash" style={{ color: '#e93e3e', fontSize: '200px' }}></i>
        <p>¿Estás seguro de que deseas eliminar esta refacción {sparePart?.description}?</p>
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

export default SparePartDelete;
