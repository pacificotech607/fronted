import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CompanyModal from './company-update';
import { ICompany } from '../../model/company.model';
import CompanyDetail from './company-detail';
import CompanyDelete from './company-delete';
import { IRootState } from '../../model/root-state';
import { getEntities } from './company.reducer';

const Company: React.FC = () => {
  const dispatch = useDispatch();
  const companies = useSelector((state: IRootState) => state.company.companies);
  const totalPages = useSelector((state: IRootState) => state.company.totalPages);
  const activePage = useSelector((state: IRootState) => state.company.page);

  useEffect(() => {
    dispatch(getEntities());
  }, [dispatch]);

  const [company, setCompany] = useState<ICompany | null>(null);

  const handlePagination = (page: number) => {
    dispatch(getEntities(page));
  };

  return (
    <div className="app-main">
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">Empresas</h3>
            </div>
            <div className="col-sm-6 text-end">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#companyUpdateModal"
                onClick={() => setCompany(null)}
              >
                Crear nuevo empresa
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="app-content" style={{ margin: '10px' }}>
        {<table className="table table-bordered">
          <thead>
            <tr>
              <th>Acciones</th>
              <th>name</th>
              <th>rfc</th>
              <th>taxRegime</th>
              <th>taxRegistrationNo</th>
              <th>taxResidence</th>
            </tr>
          </thead>
          <tbody>
            {companies && companies.map((company, i) => (
              <tr key={`entity-${i}`} className="align-middle">
                <td style={{ width: '10px' }}>
                  <div className="btn-group mb-2" role="group" aria-label="Basic outlined example">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#companyUpdateModal"
                        onClick={() => setCompany(company)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#companyDetailModal"
                      onClick={() => setCompany(company)}
                      title="Ver"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#companyDeleteModal"
                      onClick={() => setCompany(company)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
                <td>{company.name}</td>
                <td>{company.rfc}</td>
                <td>{company.taxRegime}</td>
                <td>{company.taxRegistrationNo}</td>
                <td>{company.taxResidence}</td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
      <div className="card-footer d-flex justify-content-center">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={`page-item ${activePage === 0 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePagination(activePage - 1)} disabled={activePage === 0}>Previous</button>
            </li>
            {Array.from(Array(totalPages).keys()).map(i => (
              <li key={i} className={`page-item ${activePage === i ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePagination(i)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${activePage === totalPages - 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePagination(activePage + 1)} disabled={activePage === totalPages - 1}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
      <CompanyModal company={company} refresh={() => {dispatch(getEntities());} } />
      <CompanyDetail company={company} />
      <CompanyDelete company={company} refresh={() => {dispatch(getEntities());} } />
    </div>
  );
};

export default Company;
