import { IOperator } from '../../model/operator.model';
import GenericModal from '../../utils/Modal';
import { useDispatch } from 'react-redux';
import { deleteEntity } from './operator.reducer';

type OperatorDeleteProps = {
  operator: IOperator | null;
  refresh: () => void;
};

const OperatorDelete: React.FC<OperatorDeleteProps> = ({ operator, refresh }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (operator && operator._id) {
      dispatch(deleteEntity(operator._id));
      refresh();
    }
  };

  return (
    <GenericModal
      id="operatorDeleteModal"
      title="Eliminar operador"
    >
      <div className="card-body p-0 text-center">
        <i className="bi bi-trash" style={{ color: '#e93e3e', fontSize: '200px' }}></i>
        <p>¿Estás seguro de que deseas eliminar este operador {operator?.name}?</p>
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

export default OperatorDelete;
