import { useDispatch } from 'react-redux';
import { IBLS } from '../../model/bls.model';
import GenericModal from '../../utils/Modal';
import { deleteEntity } from './bls.reducer';
import { toast } from 'react-toastify';

type BlsDeleteProps = {
  bl: IBLS | null;
  refresh: () => void;
};

const BlsDelete: React.FC<BlsDeleteProps> = ({ bl, refresh }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (bl && bl._id) {
      dispatch(deleteEntity(bl._id));
      toast.success(`BL ${bl.bl} Eliminado`, {
        position: "top-right",
      });
      refresh();
    }
  };

  return (
    <GenericModal id="blDeleteModal" title="Eliminar BL">
      <div className="card-body p-0 text-center">
        <i className="bi bi-trash" style={{ color: '#e93e3e', fontSize: '200px' }}></i>
        <p>¿Estás seguro de que deseas eliminar este BL {bl?.bl}?</p>
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

export default BlsDelete;
