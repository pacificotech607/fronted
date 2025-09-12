import { ITab } from '../../model/tab.model';
import GenericModal from '../../utils/Modal';
import { useDispatch } from 'react-redux';
import { deleteEntity } from './tab.reducer';
import { toast } from 'react-toastify';

type TabDeleteProps = {
  tab: ITab | null;
  refresh: () => void;
};

const TabDelete: React.FC<TabDeleteProps> = ({ tab, refresh }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (tab && tab._id) {
      dispatch(deleteEntity(tab._id));
      toast.success(`Pestaña ${tab.description} Eliminado`, {
        position: "top-right",
      });
      refresh();
    }
  };

  return (
    <GenericModal
      id="tabDeleteModal"
      title="Eliminar pestaña"
    >
      <div className="card-body p-0 text-center">
        <i className="bi bi-trash" style={{ color: '#e93e3e', fontSize: '200px' }}></i>
        <p>¿Estás seguro de que deseas eliminar esta pestaña {tab?.description}?</p>
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

export default TabDelete;
