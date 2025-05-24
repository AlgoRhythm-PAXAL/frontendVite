import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const RenderVehicleUpdateForm = ({ formData, setFormData,rowData }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${backendURL}/admin/branch/all`, {
          withCredentials: true,
          timeout: 10000,
        });
        setData(response.data.userData);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('Error fetching vehicles:', error);
        toast.error('Failed to load vehicles', {
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, [backendURL]);

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Vehicle ID (Read-only)</Label>
          <Input value={rowData?.vehicleId || ""} disabled placeholder="Vehicle ID" />
          
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Registration Number</Label>
          <Input
            value={formData.registrationNo !== undefined ? formData.registrationNo : rowData?.registrationNo || ""}
            onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
            placeholder="E.g., ABC-1234"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Vehicle Type</Label>
          <Select
            value={formData.vehicleType !== undefined ? formData.vehicleType : rowData?.vehicleType || ""}
            onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shipment">Shipment Vehicle</SelectItem>
              <SelectItem value="pickupDelivery">Pickup/Delivery Vehicle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Assigned Branch</Label>
          {isLoading ? (
            <div className="animate-pulse h-10 bg-gray-200 rounded-lg"></div>
          ) : (
            <Select
              value={formData.assignedBranch !== undefined ? formData.assignedBranch : rowData?.assignedBranch || ""}
              onValueChange={(value) => setFormData({ ...formData, assignedBranch: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(data) &&data.map((branch) => (
                  <SelectItem key={branch._id} value={branch._id}>
                    {branch.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Maximum Volume Capacity (m³)</Label>
          <Input
            type="number"
            value={formData.capableVolume !== undefined ? formData.capableVolume : rowData?.capableVolume || ""}
            onChange={(e) =>
              setFormData({ ...formData, capableVolume: parseFloat(e.target.value) || '' })
            }
            placeholder="Enter volume capacity"
            min="1"
            step="0.1"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Maximum Weight Capacity (kg)</Label>
          <Input
            type="number"
            
            value={formData.capableWeight !== undefined ? formData.capableWeight : rowData?.capableWeight || ""}
            onChange={(e) =>
              setFormData({ ...formData, capableWeight: parseFloat(e.target.value) || '' })
            }
            placeholder="Enter weight capacity"
            min="1"
            step="0.1"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Available</Label>
          <Switch
            checked={formData.available || false}
            value={formData.available !== undefined ? formData.available : rowData?.available || false}
            onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
          />
        </div>
      </div>
    </>
  );
};

export default RenderVehicleUpdateForm;