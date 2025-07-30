import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const CancelParcelDialog = ({ 
  isOpen, 
  onClose, 
  parcelData, 
  onUpdate 
}) => {
  const [formData, setFormData] = useState({
    reason: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const cancelReasons = [
    { value: "customer_request", label: "Customer Request" },
    { value: "unable_to_pickup", label: "Unable to Pickup" },
    { value: "incorrect_details", label: "Incorrect Details" },
    { value: "payment_issue", label: "Payment Issue" },
    { value: "item_not_available", label: "Item Not Available" },
    { value: "duplicate_order", label: "Duplicate Order" },
    { value: "customer_unavailable", label: "Customer Unavailable" },
    { value: "other", label: "Other" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.reason) {
      setError('Please select a cancellation reason');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Please provide a description for the cancellation');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${backendURL}/api/admin/parcels/${parcelData._id}/status`,
        {
          status: 'Cancelled',
          reason: formData.reason,
          description: formData.description.trim()
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.status === 'success' || response.data.success) {
        toast.success('Parcel cancelled successfully! 🎉', {
          description: 'The parcel has been marked as cancelled and data has been updated.',
          duration: 4000,
        });
        
        // Reset form
        setFormData({ reason: '', description: '' });
        setError(null);
        
        // Close dialog first
        onClose();
        
        // Then trigger data refetch with a small delay
        setTimeout(() => {
          onUpdate();
        }, 100);
      } else {
        throw new Error(response.data.message || 'Failed to cancel parcel');
      }
    } catch (error) {
      console.error('Error cancelling parcel:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to cancel parcel. Please try again.';
      setError(errorMessage);
      toast.error('Failed to cancel parcel! ❌', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ reason: '', description: '' });
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Cancel Parcel
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="cancel-reason">Cancellation Reason *</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => handleInputChange('reason', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cancellation reason" />
              </SelectTrigger>
              <SelectContent>
                {cancelReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancel-description">Description *</Label>
            <Textarea
              id="cancel-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Please provide details about why this parcel is being cancelled..."
              className="min-h-[100px]"
              disabled={loading}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.description.length}/500
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-sm text-red-800">
              <strong>Warning:</strong> Cancelling this parcel will:
              <ul className="mt-1 ml-4 list-disc text-xs">
                <li>Change the status to "Cancelled"</li>
                <li>Stop all further processing</li>
                <li>Record the cancellation details permanently</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="gap-2">
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
              variant="destructive"
              disabled={loading || !formData.reason || !formData.description.trim()}
              className="min-w-[100px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Parcel'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelParcelDialog;
