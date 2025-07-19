import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

const RenderShipmentUpdateForm = (formData, setFormData, rowData ) => {
  const [branches, setBranches] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchRes, vehicleRes, driverRes] = await Promise.all([
          axios.get(`${backendURL}/api/admin/branches`, { withCredentials: true }),
          axios.get(`${backendURL}/api/admin/vehicles`, { withCredentials: true }),
          axios.get(`${backendURL}/api/admin/users/driver`, { withCredentials: true }),
        ]);
        setBranches(branchRes.data.userData);
        setVehicles(vehicleRes.data.userData);
        setDrivers(driverRes.data.userData);
      } catch (error) {
        toast.error("Failed to fetch data", {
          description: error.message || "Something went wrong!",
        });
      }
    };
    fetchData();
  }, [backendURL]);


   if (!rowData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="space-y-4 ">
      <div className="space-y-2">
        <Label>Shipment ID (Read-only)</Label>
        <Input value={rowData?.shipmentId || ""} disabled />
      </div>

      <div className="space-y-2">
        <Label>Delivery Type</Label>
        <Select
          value={formData.deliveryType || rowData?.deliveryType || ""}
          onValueChange={(value) => setFormData({ ...formData, deliveryType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Delivery Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Express">Express</SelectItem>
            <SelectItem value="Standard">Standard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Source Center</Label>
        <Select
          value={formData.sourceCenter || rowData?.sourceCenter || ""}
          onValueChange={(value) => setFormData({ ...formData, sourceCenter: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Source Center" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch._id} value={branch._id}>
                {branch.location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Route (Comma Separated)</Label>
        <Input
          value={formData.route?.join(", ") || rowData?.route?.join(", ") || ""}
          onChange={(e) => setFormData({ ...formData, route: e.target.value.split(",").map(s => s.trim()) })}
          placeholder="E.g., Colombo, Gampaha, Kandy"
        />
      </div>

      <div className="space-y-2">
        <Label>Total Time (hrs)</Label>
        <Input
          type="number"
          value={formData.totalTime || rowData?.totalTime || ""}
          onChange={(e) => setFormData({ ...formData, totalTime: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label>Total Distance (km)</Label>
        <Input
          type="number"
          value={formData.totalDistance || rowData?.totalDistance || ""}
          onChange={(e) => setFormData({ ...formData, totalDistance: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label>Total Weight (kg)</Label>
        <Input
          type="number"
          value={formData.totalWeight || rowData?.totalWeight || ""}
          onChange={(e) => setFormData({ ...formData, totalWeight: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label>Total Volume (m³)</Label>
        <Input
          type="number"
          value={formData.totalVolume || rowData?.totalVolume || ""}
          onChange={(e) => setFormData({ ...formData, totalVolume: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label>Parcel Count</Label>
        <Input
          type="number"
          value={formData.parcelCount || rowData?.parcelCount || ""}
          onChange={(e) => setFormData({ ...formData, parcelCount: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label>Assigned Vehicle</Label>
        <Select
          value={formData.assignedVehicle || rowData?.assignedVehicle || ""}
          onValueChange={(value) => setFormData({ ...formData, assignedVehicle: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Vehicle" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle._id} value={vehicle._id}>
                {vehicle.registrationNo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Assigned Driver</Label>
        <Select
          value={formData.assignedDriver || rowData?.assignedDriver || ""}
          onValueChange={(value) => setFormData({ ...formData, assignedDriver: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Driver" />
          </SelectTrigger>
          <SelectContent>
            {drivers.map((driver) => (
              <SelectItem key={driver._id} value={driver._id}>
                {driver.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={formData.status || rowData?.status || ""}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="In Transit">In Transit</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Created By Center</Label>
        <Select
          value={formData.createdByCenter || rowData?.createdByCenter || ""}
          onValueChange={(value) => setFormData({ ...formData, createdByCenter: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Center" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Colombo">Colombo</SelectItem>
            <SelectItem value="Gampaha">Gampaha</SelectItem>
            <SelectItem value="Kalutara">Kalutara</SelectItem>
            <SelectItem value="Kandy">Kandy</SelectItem>
            <SelectItem value="Galle">Galle</SelectItem>
            <SelectItem value="Jaffna">Jaffna</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RenderShipmentUpdateForm;
