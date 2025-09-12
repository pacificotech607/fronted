import { ISparePart } from '../../model/sparePart.model';
import GenericModal from '../../utils/Modal';

type SparePartDetailProps = {
    sparePart: ISparePart | null;
};

const SparePartDetail: React.FC<SparePartDetailProps> = ({ sparePart }) => {
    return (
        <GenericModal
            id="sparePartDetailModal"
            title="Detalles de la refacción"
        >
            <div className="card-body p-0">
                <table className="table table-striped">
                    <tbody>
                        <tr className="align-middle">
                            <td>Descripción</td>
                            <td>{sparePart?.description}</td>
                        </tr>
                        <tr>
                            <td>Código</td>
                            <td>{sparePart?.code}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Precio</td>
                            <td>{sparePart?.price}</td>
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

export default SparePartDetail;
