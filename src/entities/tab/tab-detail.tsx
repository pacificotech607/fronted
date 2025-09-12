import { ITab } from '../../model/tab.model';
import GenericModal from '../../utils/Modal';

type TabDetailProps = {
    tab: ITab | null;
};

const TabDetail: React.FC<TabDetailProps> = ({ tab }) => {
    return (
        <GenericModal
            id="tabDetailModal"
            title="Detalles de la pestaña"
        >
            <div className="card-body p-0">
                <table className="table table-striped">
                    <tbody>
                        <tr className="align-middle">
                            <td>Descripción</td>
                            <td>{tab?.description}</td>
                        </tr>
                        <tr>
                            <td>Distancia (Km)</td>
                            <td>{tab?.distanceKm}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Diesel consumido</td>
                            <td>{tab?.dieselConsumed}</td>
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

export default TabDetail;
