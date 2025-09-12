import { useDispatch } from 'react-redux';
import { IPatio } from '../../model/patio.model';
import GenericModal from '../../utils/Modal';
import { deleteEntity } from './patio.reducer';
import { toast } from 'react-toastify';

type PatioDeleteProps = {
  patio: IPatio | null;
  refresh: () => void;
};

const PatioDelete: React.FC<PatioDeleteProps> = ({ patio, refresh }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (patio && patio._id) {
      dispatch(deleteEntity(patio._id));
      toast.success(`Patio ${patio.name} Eliminado`, {
        position: "top-right",
      });
      refresh();
    }
  };

  return (
    <GenericModal id="patioDeleteModal" title="Eliminar patio">
      <div className="card-body p-0 text-center">
        <i className="bi bi-trash" style={{ color: '#e93e3e', fontSize: '200px' }}></i>
        <p>¿Estás seguro de que deseas eliminar este patio {patio?.name}?</p>
        <br />
        <div className="row g-3">
          <div className="col-md-12 text-center">
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" style={{ marginRight: '10px' }}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDelete}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </GenericModal>
  );
};

export default PatioDelete;
