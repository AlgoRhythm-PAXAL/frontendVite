import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, XCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const UpdateParcelStatusDialog = ({ 
  isOpen, 
  onClose, 
  parcelData, 
  onUpdate,
  statusType // 'cancel' or 'return'
}) => {
  const [formData, setFormData] = useState({
    reason: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const isCancel = statusType === 'cancel';
  const status = isCancel ? 'Cancelled' : 'Return';
  const icon = isCancel ? <XCircle className="h-5 w-5 text-red-600" /> : <RotateCcw className="h-5 w-5 text-orange-600" />;
  
  const reasons = isCancel ? [
    { value: "customer_request", label: "Customer Request" },
    { value: "unable_to_pickup", label: "Unable to Pickup" },
    { value: "incorrect_details", label: "Incorrect Details" },
    { value: "payment_issue", label: "Payment Issue" },
    { value: "item_not_available", label: "Item Not Available" },
    { value: "other", label: "Other" }
  ] : [
    { value: "recipient_refused", label: "Recipient Refused" },
    { value: "wrong_address", label: "Wrong Address" },
    { value: "recipient_not_available", label: "Recipient Not Available" },
    { value: "damaged_item", label: "Damaged Item" },
    { value: "incomplete_address", label: "Incomplete Address" },
    { value: "other", label: "Other" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reason) {
      setError('Please select a reason');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${backendURL}/api/admin/parcels/${parcelData._id}/status`,
        {
          status,
          reason: formData.reason,
          description: formData.description
        },
        { withCredentials: true }
      );

      toast.success(`Parcel ${status.toLowerCase()} successfully`);
      onUpdate?.(response.data.data.parcel);
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to ${status.toLowerCase()} parcel`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ reason: '', description: '' });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            {status} Parcel - #{parcelData?.parcelId}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Selection */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for {status} <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.reason} 
              onValueChange={(value) => handleInputChange('reason', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${status.toLowerCase()} reason`} />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Additional Details (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder={`Enter additional details about the ${status.toLowerCase()}...`}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          {/* Warning Message */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This action will change the parcel status to &quot;{status}&quot; and cannot be easily undone. 
              Please ensure this is correct before proceeding.
            </AlertDescription>
          </Alert>

          {/* Dialog Footer */}
          <DialogFooter className="flex items-center gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.reason}
              variant={isCancel ? "destructive" : "default"}
              className={isCancel ? "" : "bg-orange-600 hover:bg-orange-700"}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <>
                  {icon}
                  <span className="ml-2">
                    {status} Parcel
                  </span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateParcelStatusDialog;
