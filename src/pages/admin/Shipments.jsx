import SectionTitle from '../../components/admin/SectionTitle';
import DemoPage from '../../components/admin/UserTables/DataTable/TableDistributor';

const shipmentColumns = [
  {
    accessorKey: 'itemId',
    header: 'Branch No',
  },
  {
    accessorKey: 'deliveryType',
    header: 'Shipment Type',
  },
  {
    accessorKey: 'route',
    header: 'Routes',
  },
  {
    accessorKey: 'sourceCenter',
    header: 'Source Branch',
  },
  {
    accessorKey: 'currentLocation',
    header: 'Current Branch',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];

const Shipments = () => {
  return (
    <div className="flex flex-col  mx-8  ">
      <SectionTitle title="Shipments" />
      <div className="flex flex-col gap-">
        <DemoPage
          title="shipment"
          columns={shipmentColumns}
          deleteEnabled={false}
          updateEnabled={false}
          disableDateFilter={true}
        />
      </div>
    </div>
  );
};

export default Shipments;
