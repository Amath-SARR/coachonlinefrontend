import { GetLibraryConnectionStatisticsActionData } from '../../../containers/Libraries/actions.types';

export default interface LibraryConnectionsStatisticsProps {
  id: number;
  getStats: (data: GetLibraryConnectionStatisticsActionData) => void;
  generateXLSX: (data: GetLibraryConnectionStatisticsActionData) => void;
  auth?: any;
}
