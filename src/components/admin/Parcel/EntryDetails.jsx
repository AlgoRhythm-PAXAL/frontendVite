import { Button } from '@/components/ui/button';
import SectionTitle from '../SectionTitle';
import { capitalize } from '../../../utils/formatters';
import ParcelDetails from './ParcelDetails';

export const EntryDetails = ({ collectionName, entryId, onClose }) => {
  return (
    <div
      className="className={`bg-white rounded-xl px-6   w-full flex flex-col max-h-[95vh] overflow-auto 
    ${collectionName === 'parcels' ? ' bg-Background min-w-[60vw]  sm:min-w-[70vw] lg:min-w-[90vw] xl:min-w-[100vw]' : ''"
    >
      <div className="flex justify-between items-center m-6 ">
        <SectionTitle
          title={`${capitalize(collectionName)} Details | ${entryId}`}
        />
        <Button
          variant="ghost"
          onClick={onClose}
          className=" text-gray-500 hover:text-red-500"
        >
          {' '}
          ✕{' '}
        </Button>
      </div>

      <div className="w-full">
        <div className="w-full justify-center items-center">
          {collectionName === 'parcel' && <ParcelDetails entryId={entryId} />}
        </div>
      </div>
    </div>
  );
};
