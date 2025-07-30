import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, X, Package, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const EditParcelDialog = ({ 
  isOpen, 
  onClose, 
  parcelData, 
  onUpdate 
}) => {
  const [formData, setFormData] = useState({});
  const [dropdownData, setDropdownData] = useState({});
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Fetch dropdown data
  const fetchDropdownData = useCallback(async () => {
    try {
      setDropdownLoading(true);
      const response = await axios.get(`${backendURL}/api/admin/parcels/dropdown-data`, {
        withCredentials: true
      });
      setDropdownData(response.data.data);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      toast.error('Failed to load dropdown options');
    } finally {
      setDropdownLoading(false);
    }
  }, [backendURL]);

  // Initialize form data when parcel data changes
  useEffect(() => {
    if (parcelData) {
      setFormData({
        itemType: parcelData.itemType || '',
        itemSize: parcelData.itemSize || '',
        specialInstructions: parcelData.specialInstructions || '',
        submittingType: parcelData.submittingType || '',
        receivingType: parcelData.receivingType || '',
        shippingMethod: parcelData.shippingMethod || '',
        from: parcelData.from?._id || '',
        to: parcelData.to?._id || '',
        // Pickup Information
        pickupDate: parcelData.pickupInformation?.pickupDate ? 
          new Date(parcelData.pickupInformation.pickupDate).toISOString().split('T')[0] : '',
        pickupTime: parcelData.pickupInformation?.pickupTime || '',
        pickupAddress: parcelData.pickupInformation?.address || '',
        pickupCity: parcelData.pickupInformation?.city || '',
        pickupDistrict: parcelData.pickupInformation?.district || '',
        pickupProvince: parcelData.pickupInformation?.province || '',
        // Delivery Information
        deliveryAddress: parcelData.deliveryInformation?.deliveryAddress || '',
        deliveryCity: parcelData.deliveryInformation?.deliveryCity || '',
        deliveryDistrict: parcelData.deliveryInformation?.deliveryDistrict || '',
        deliveryProvince: parcelData.deliveryInformation?.deliveryProvince || '',
        postalCode: parcelData.deliveryInformation?.postalCode || ''
      });
    }
  }, [parcelData]);

  // Fetch dropdown data on mount
  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen, fetchDropdownData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the update payload
      const updatePayload = {
        itemType: formData.itemType,
        itemSize: formData.itemSize,
        specialInstructions: formData.specialInstructions,
        submittingType: formData.submittingType,
        receivingType: formData.receivingType,
        shippingMethod: formData.shippingMethod,
        from: formData.from,
        to: formData.to,
        pickupInformation: {
          pickupDate: formData.pickupDate,
          pickupTime: formData.pickupTime,
          address: formData.pickupAddress,
          city: formData.pickupCity,
          district: formData.pickupDistrict,
          province: formData.pickupProvince
        },
        deliveryInformation: {
          deliveryAddress: formData.deliveryAddress,
          deliveryCity: formData.deliveryCity,
          deliveryDistrict: formData.deliveryDistrict,
          deliveryProvince: formData.deliveryProvince,
          postalCode: formData.postalCode
        }
      };

      const response = await axios.put(
        `${backendURL}/api/admin/parcels/${parcelData._id}/details`,
        updatePayload,
        { withCredentials: true }
      );

      toast.success('Parcel details updated successfully');
      onUpdate?.(response.data.data.parcel);
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update parcel details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (dropdownLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading form data...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Edit Parcel Details - #{parcelData?.parcelId}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Item Type */}
              <div className="space-y-2">
                <Label htmlFor="itemType">Item Type</Label>
                <Select 
                  value={formData.itemType} 
                  onValueChange={(value) => handleInputChange('itemType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownData.itemTypes?.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Item Size */}
              <div className="space-y-2">
                <Label htmlFor="itemSize">Item Size</Label>
                <Select 
                  value={formData.itemSize} 
                  onValueChange={(value) => handleInputChange('itemSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item size" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownData.itemSizes?.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Shipping Method */}
              <div className="space-y-2">
                <Label htmlFor="shippingMethod">Shipping Method</Label>
                <Select 
                  value={formData.shippingMethod} 
                  onValueChange={(value) => handleInputChange('shippingMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shipping method" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownData.shippingMethods?.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submitting Type */}
              <div className="space-y-2">
                <Label htmlFor="submittingType">Submitting Type</Label>
                <Select 
                  value={formData.submittingType} 
                  onValueChange={(value) => handleInputChange('submittingType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select submitting type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownData.submittingTypes?.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Receiving Type */}
              <div className="space-y-2">
                <Label htmlFor="receivingType">Receiving Type</Label>
                <Select 
                  value={formData.receivingType} 
                  onValueChange={(value) => handleInputChange('receivingType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select receiving type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownData.receivingTypes?.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* From Branch */}
              <div className="space-y-2">
                <Label htmlFor="from">From Branch</Label>
                <Select 
                  value={formData.from} 
                  onValueChange={(value) => handleInputChange('from', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownData.branches?.map((branch) => (
                      <SelectItem key={branch.value} value={branch.value}>
                        {branch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* To Branch */}
              <div className="space-y-2">
                <Label htmlFor="to">To Branch</Label>
                <Select 
                  value={formData.to} 
                  onValueChange={(value) => handleInputChange('to', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownData.branches?.map((branch) => (
                      <SelectItem key={branch.value} value={branch.value}>
                        {branch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                placeholder="Enter any special instructions..."
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Pickup Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Pickup Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupDate">Pickup Date</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupTime">Pickup Time</Label>
                <Select 
                  value={formData.pickupTime} 
                  onValueChange={(value) => handleInputChange('pickupTime', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pickup time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00 - 12:00">08:00 - 12:00</SelectItem>
                    <SelectItem value="13:00 - 17:00">13:00 - 17:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address</Label>
                <Textarea
                  id="pickupAddress"
                  placeholder="Enter pickup address..."
                  value={formData.pickupAddress}
                  onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupCity">Pickup City</Label>
                <Input
                  id="pickupCity"
                  placeholder="Enter pickup city"
                  value={formData.pickupCity}
                  onChange={(e) => handleInputChange('pickupCity', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupDistrict">Pickup District</Label>
                <Input
                  id="pickupDistrict"
                  placeholder="Enter pickup district"
                  value={formData.pickupDistrict}
                  onChange={(e) => handleInputChange('pickupDistrict', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupProvince">Pickup Province</Label>
                <Input
                  id="pickupProvince"
                  placeholder="Enter pickup province"
                  value={formData.pickupProvince}
                  onChange={(e) => handleInputChange('pickupProvince', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Delivery Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <Textarea
                  id="deliveryAddress"
                  placeholder="Enter delivery address..."
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryCity">Delivery City</Label>
                <Input
                  id="deliveryCity"
                  placeholder="Enter delivery city"
                  value={formData.deliveryCity}
                  onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDistrict">Delivery District</Label>
                <Input
                  id="deliveryDistrict"
                  placeholder="Enter delivery district"
                  value={formData.deliveryDistrict}
                  onChange={(e) => handleInputChange('deliveryDistrict', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryProvince">Delivery Province</Label>
                <Input
                  id="deliveryProvince"
                  placeholder="Enter delivery province"
                  value={formData.deliveryProvince}
                  onChange={(e) => handleInputChange('deliveryProvince', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="Enter postal code"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="flex items-center gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditParcelDialog;
