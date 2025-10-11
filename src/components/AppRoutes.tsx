import { Routes, Route } from 'react-router-dom';
import Company from '../entities/company/company';
import User from '../entities/user/user';
import Operator from '../entities/operator/operator';
import MotorTransport from '../entities/motorTransport/motorTransport';
import Patio from '../entities/patio/patio';
import Tab from '../entities/tab/tab';
import SparePart from '../entities/sparePart/sparePart';
import Valuelist from '../entities/valuelist/valuelist';
import BLS from '../entities/bls/bls';
import Fuel from '../entities/fuel/fuel';
import AssignPort from '../modules/assignPort/assign-port';
import AssignTrips from '../modules/assignTrips/assign-trips';
import PortExitReview from '../modules/portexitreview/port-exit-review';
import ReturnPort from '../modules/returnport/return-port';
import TripExitReview from '../modules/tripexitreview/trip-exit-review';
import ReturnTrip from '../modules/returntrip/return-trip';
import Invoice from '../entities/invoice/invoice';
import Home from '../entities/home';
import FuelInventory from '../entities/fuelInventory/fuelInventory';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/user" element={<User />} />
      <Route path="/company" element={<Company />} />
      <Route path="/fuel" element={<Fuel />} />
      <Route path="/operator" element={<Operator />} />
      <Route path="/motorTransport" element={<MotorTransport />} />
      <Route path="/patio" element={<Patio />} />
      <Route path="/tab" element={<Tab />} />
      <Route path="/sparePart" element={<SparePart />} />
      <Route path="/valuelist" element={<Valuelist />} />
      <Route path="/bls" element={<BLS />} />
      <Route path="/assignPort" element={<AssignPort />} />
      <Route path="/assignTrips" element={<AssignTrips />} />
      <Route path="/portExitReview" element={<PortExitReview />} />
      <Route path="/returnPort" element={<ReturnPort />} />
      <Route path="/tripExitReview" element={<TripExitReview />} />
      <Route path="/returnTrip" element={<ReturnTrip />} />
      <Route path="/invoice" element={<Invoice />} />
      <Route path="/credit-note" element={<Invoice />} />
      <Route path="/fuelInventory" element={<FuelInventory />} />
    </Routes>
  );
};

export default AppRoutes;