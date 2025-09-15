import { useDispatch } from 'react-redux';
import { IValuelist } from '../../model/valuelist.model';
import GenericModal from '../../utils/Modal';
import { deleteEntity } from './valuelist.reducer';

import { toast } from 'react-toastify';

type ValuelistDeleteProps = {
  valuelist: IValuelist | null;
  refresh: () => void;
};

const ValuelistDelete: React.FC<ValuelistDeleteProps> = ({ valuelist, refresh }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (valuelist && valuelist._id) {
      dispatch(deleteEntity(valuelist._id));
      toast.success(`Valuelist ${valuelist.name} Eliminado`, {
        position: "top-right",
      });
      refresh();
    }
  };

  return (
    <GenericModal id="valuelistDeleteModal" title="Eliminar valuelist">
      <div className="card-body p-0 text-center">
        <i className="bi bi-trash" style={{ color: '#e93e3e', fontSize: '200px' }}></i>
        <p>¿Estás seguro de que deseas eliminar este valuelist {valuelist?.name}?</p>
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

export default ValuelistDelete;
