import { ICompany } from '../../model/company.model';
import GenericModal from '../../utils/Modal';
import { useDispatch } from 'react-redux';
import { deleteEntity } from './company.reducer';

type CompanyDeleteProps = {
  company: ICompany | null;
  refresh: () => void;
};

const CompanyDelete: React.FC<CompanyDeleteProps> = ({ company, refresh }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (company && company._id) {
      dispatch(deleteEntity(company._id));
      refresh();
    }
  };

  return (
    <GenericModal
      id="companyDeleteModal"
      title="Eliminar usuario"
    >
      <div className="card-body p-0 text-center">
        <i className="bi bi-trash" style={{ color: '#e93e3e', fontSize: '200px' }}></i>
        <p>¿Estás seguro de que deseas eliminar este usuario {company?.name}?</p>
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

export default CompanyDelete;
