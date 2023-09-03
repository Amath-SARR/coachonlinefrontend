import { LibraryStatistics } from '../../containers/Libraries/reducer.types';

export interface LibraryStatisticsProps {
  statistics: LibraryStatistics | null;
  statisticsRange: LibraryStatistics | null;
  onFetch: (startDate: string, endDate: string) => void;
  libraries: any;
}
