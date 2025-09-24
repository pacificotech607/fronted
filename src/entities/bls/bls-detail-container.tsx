import { IBLS } from '../../model/bls.model';
import GenericModal from '../../utils/Modal';

type BlsDetailContainerProps = {
    bl: IBLS | null;
};

const BlsDetailContainer: React.FC<BlsDetailContainerProps> = ({ bl }) => {
    return (
        <GenericModal
            id="blDetailContainerModal"
            title="Lista de contenedores"
        >
            <div className="card-body p-0">
                <table className="table table-striped">
                    <tbody>
                        {bl?.containers?.map((container, i) => (
                            <tr className="align-middle" key={i}>
                                <td>{`Contenedor ${i + 1}`}</td>
                                <td>{container}</td>
                            </tr>
                        ))}
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

export default BlsDetailContainer;
