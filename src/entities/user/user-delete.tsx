import { IUser } from '../../model/user.model';
import GenericModal from '../../utils/Modal';
import { useDispatch } from 'react-redux';
import { deleteEntity } from './user.reducer';

type UserDeleteProps = {
  user: IUser | null;
  refresh: () => void;
};

const UserDelete: React.FC<UserDeleteProps> = ({ user, refresh }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (user && user._id) {
      dispatch(deleteEntity(user._id));
      refresh();
    }
  };

  return (
    <GenericModal
      id="userDeleteModal"
      title="Eliminar usuario"
    >
      <div className="card-body p-0 text-center">
        <i className="bi bi-trash" style={{ color: '#e93e3e', fontSize: '200px' }}></i>
        <p>¿Estás seguro de que deseas eliminar este usuario {user?.login}?</p>
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

export default UserDelete;
