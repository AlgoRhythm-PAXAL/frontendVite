import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const ReturnParcelDialog = ({ 
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

  const returnReasons = [
    { value: "recipient_refused", label: "Recipient Refused Delivery" },
    { value: "wrong_address", label: "Wrong/Incorrect Address" },
    { value: "recipient_not_available", label: "Recipient Not Available" },
    { value: "damaged_item", label: "Item Damaged During Transit" },
    { value: "incomplete_address", label: "Incomplete Address Details" },
    { value: "access_restricted", label: "Restricted Access to Location" },
    { value: "recipient_relocated", label: "Recipient Has Relocated" },
    { value: "refused_payment", label: "Refused to Pay COD" },
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
      setError('Please select a return reason');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Please provide a description for the return');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${backendURL}/api/admin/parcels/${parcelData._id}/status`,
        {
          status: 'Return',
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
        toast.success('Parcel marked for return successfully! 📦', {
          description: 'The parcel has been marked for return and data has been updated.',
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
        throw new Error(response.data.message || 'Failed to mark parcel for return');
      }
    } catch (error) {
      console.error('Error returning parcel:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to mark parcel for return. Please try again.';
      setError(errorMessage);
      toast.error('Failed to process return! ❌', {
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
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <RotateCcw className="h-5 w-5" />
            Return Parcel
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
            <Label htmlFor="return-reason">Return Reason *</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => handleInputChange('reason', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select return reason" />
              </SelectTrigger>
              <SelectContent>
                {returnReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="return-description">Description *</Label>
            <Textarea
              id="return-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Please provide details about why this parcel is being returned..."
              className="min-h-[100px]"
              disabled={loading}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.description.length}/500
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="text-sm text-orange-800">
              <strong>Note:</strong> Returning this parcel will:
              <ul className="mt-1 ml-4 list-disc text-xs">
                <li>Change the status to &quot;Return&quot;</li>
                <li>Initiate return logistics process</li>
                <li>Send parcel back to sender</li>
                <li>Record return details for tracking</li>
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
              className="min-w-[100px] bg-orange-600 hover:bg-orange-700"
              disabled={loading || !formData.reason || !formData.description.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Return Parcel'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnParcelDialog;
