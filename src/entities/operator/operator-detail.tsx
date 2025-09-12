import { IOperator } from '../../model/operator.model';
import GenericModal from '../../utils/Modal';

type OperatorDetailProps = {
    operator: IOperator | null;
};

const OperatorDetail: React.FC<OperatorDetailProps> = ({ operator }) => {
    return (
        <GenericModal
            id="operatorDetailModal"
            title="Detalles del operador"
        >
            <div className="card-body p-0">
                <table className="table table-striped">
                    <tbody>
                        <tr className="align-middle">
                            <td>Nombre</td>
                            <td>{operator?.name}</td>
                        </tr>
                        <tr>
                            <td>Licencia</td>
                            <td>{operator?.license}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Vigencia</td>
                            <td>{operator?.vigencia}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>RFC</td>
                            <td>{operator?.rfc}</td>
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

export default OperatorDetail;
