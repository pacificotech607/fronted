import { IValuelist } from '../../model/valuelist.model';
import GenericModal from '../../utils/Modal';

type ValuelistDetailProps = {
    valuelist: IValuelist | null;
};

const ValuelistDetail: React.FC<ValuelistDetailProps> = ({ valuelist }) => {
    return (
        <GenericModal
            id="valuelistDetailModal"
            title="Detalles del valuelist"
        >
            <div className="card-body p-0">
                <table className="table table-striped">
                    <tbody>
                        <tr className="align-middle">
                            <td>Type</td>
                            <td>{valuelist?.type}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Name</td>
                            <td>{valuelist?.name}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>English Label</td>
                            <td>{valuelist?.enLabel}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Spanish Label</td>
                            <td>{valuelist?.esLabel}</td>
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

export default ValuelistDetail;
