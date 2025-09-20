import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserModal from './user-update';
import { IUser } from '../../model/user.model';
import UserDetail from './user-detail';
import UserDelete from './user-delete';
import { IRootState } from '../../model/root-state';
import { getEntities } from './user.reducer';
import GenericMultiTagSearch from '../../utils/searchInput';

const User: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: IRootState) => state.user.users);
  const totalPages = useSelector((state: IRootState) => state.user.totalPages);
  const activePage = useSelector((state: IRootState) => state.user.page);
  const [user, setUser] = useState<IUser | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(JSON.stringify({ alive: true }));

  useEffect(() => {
    dispatch(getEntities(0, 20, searchQuery || undefined));
  }, [dispatch]);

  const handlePagination = (page: number) => {
    dispatch(getEntities(page, 20, searchQuery || undefined));
  };

  const handleSearch = (query: string | null) => {
    const aliveFilter = { alive: true };
    let finalQueryObject: any = aliveFilter;

    if (query) {
      try {
        const userQuery = JSON.parse(query);
        finalQueryObject = {
          $and: [aliveFilter, userQuery],
        };
      } catch (error) {
        console.error("Failed to parse search query:", error);
      }
    }

    const finalQueryString = JSON.stringify(finalQueryObject);
    setSearchQuery(finalQueryString);
    dispatch(getEntities(0, 20, finalQueryString));
  };

  const searchOptions = [
    { value: 'user', label: 'Usuario' },
    { value: 'email', label: 'Correo' },
    { value: 'workstation', label: 'Puesto' },
  ];

  return (
    <div className="app-main">
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">Usuarios</h3>
            </div>
            <div className="col-sm-6 text-end">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#userUpdateModal"
                onClick={() => setUser(null)}
              >
                Crear nuevo usuario
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="app-content" style={{ margin: '10px' }}>
      <div style={{ marginBottom: '20px' }}>
      <GenericMultiTagSearch
        searchOptions={searchOptions}
        onSearchButtonClick={handleSearch}
      />
      </div>
        {<table className="table table-bordered">
          <thead>
            <tr>
              <th>Acciones</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Puesto</th>
            </tr>
          </thead>
          <tbody>
            {users && users.map((user, i) => (
              <tr key={`entity-${i}`} className="align-middle">
                <td style={{ width: '10px' }}>
                  <div className="btn-group mb-2" role="group" aria-label="Basic outlined example">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#userUpdateModal"
                        onClick={() => setUser(user)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#userDetailModal"
                      onClick={() => setUser(user)}
                      title="Ver"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#userDeleteModal"
                      onClick={() => setUser(user)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
                <td>{user.user}</td>
                <td>{user.email}</td>
                <td>{user.workstation}</td>
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
      <UserModal user={user} refresh={() => {dispatch(getEntities(0, 20, searchQuery || undefined));} } />
      <UserDetail user={user} />
      <UserDelete user={user} refresh={() => {dispatch(getEntities(0, 20, searchQuery || undefined));} } />
    </div>
  );
};

export default User;
