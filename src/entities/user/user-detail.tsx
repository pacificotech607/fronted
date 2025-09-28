import { IUser } from '../../model/user.model';
import GenericModal from '../../utils/Modal';

type UserDetailProps = {
    user: IUser | null;
};

const UserDetail: React.FC<UserDetailProps> = ({ user }) => {
    return (
        <GenericModal
            id="userDetailModal"
            title="Detalles del usuario"
        >|
            <div className="card-body p-0">
                <table className="table table-striped">
                    <tbody>
                        <tr className="align-middle">
                            <td>User</td>
                            <td>{user?.login}</td>
                        </tr>
                        <tr>
                            <td>Correo</td>
                            <td>{user?.email}</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <div className="row g-3">
                    <div className="col-md-12 text-end">
                        <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-dismiss="modal"
                        >Aceptar</button>
                    </div>
                </div>
            </div>
        </GenericModal>
    );
};

export default UserDetail;
