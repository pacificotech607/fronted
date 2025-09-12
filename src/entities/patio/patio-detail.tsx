import { IPatio } from '../../model/patio.model';
import GenericModal from '../../utils/Modal';

type PatioDetailProps = {
    patio: IPatio | null;
};

const PatioDetail: React.FC<PatioDetailProps> = ({ patio }) => {
    return (
        <GenericModal
            id="patioDetailModal"
            title="Detalles del patio"
        >
            <div className="card-body p-0">
                <table className="table table-striped">
                    <tbody>
                        <tr className="align-middle">
                            <td>Nombre</td>
                            <td>{patio?.name}</td>
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

export default PatioDetail;
