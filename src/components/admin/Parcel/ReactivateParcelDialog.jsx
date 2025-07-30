import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const ReactivateParcelDialog = ({ 
  isOpen, 
  onClose, 
  parcelData, 
  onUpdate 
}) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const handleInputChange = (value) => {
    setDescription(value);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!description.trim()) {
      setError('Please provide a reason for reactivating this parcel');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${backendURL}/api/admin/parcels/${parcelData._id}/status`,
        {
          status: 'OrderPlaced',
          reason: 'reactivation',
          description: description.trim()
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.status === 'success' || response.data.success) {
        toast.success('Parcel reactivated successfully! ✅', {
          description: 'The parcel has been reactivated and is now back to Order Placed status.',
          duration: 4000,
        });
        
        // Reset form
        setDescription('');
        setError(null);
        
        // Close dialog first
        onClose();
        
        // Then trigger data refetch with a small delay
        setTimeout(() => {
          onUpdate();
        }, 100);
      } else {
        throw new Error(response.data.message || 'Failed to reactivate parcel');
      }
    } catch (error) {
      console.error('Error reactivating parcel:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to reactivate parcel. Please try again.';
      setError(errorMessage);
      toast.error('Failed to reactivate parcel! ❌', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setDescription('');
      setError(null);
      onClose();
    }
  };

  const currentStatus = parcelData?.status;
  const isValidForReactivation = currentStatus === 'Cancelled' || currentStatus === 'Return';

  if (!isValidForReactivation) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <RotateCcw className="h-5 w-5" />
            Reactivate Parcel
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
            <Label htmlFor="reactivate-description">Reason for Reactivation *</Label>
            <Textarea
              id="reactivate-description"
              value={description}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Please provide a detailed reason for reactivating this parcel..."
              className="min-h-[100px]"
              disabled={loading}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">
              {description.length}/500
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-sm text-green-800">
              <strong>Note:</strong> Reactivating this parcel will:
              <ul className="mt-1 ml-4 list-disc text-xs">
                <li>Change status back to &quot;Order Placed&quot;</li>
                <li>Clear all cancellation/return information</li>
                <li>Reset all tracking timestamps</li>
                <li>Allow normal processing to resume</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <strong>Current Status:</strong> {currentStatus === 'Cancelled' ? 'Cancelled' : 'Return'}
              {parcelData?.cancellationInfo && (
                <div className="mt-1 text-xs">
                  <strong>Cancelled by:</strong> {parcelData.cancellationInfo.cancelledBy?.name || 'Admin'}
                  <br />
                  <strong>Date:</strong> {new Date(parcelData.cancellationInfo.cancelledAt).toLocaleString()}
                </div>
              )}
              {parcelData?.returnInfo && (
                <div className="mt-1 text-xs">
                  <strong>Returned by:</strong> {parcelData.returnInfo.returnedBy?.name || 'Admin'}
                  <br />
                  <strong>Date:</strong> {new Date(parcelData.returnInfo.returnedAt).toLocaleString()}
                </div>
              )}
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
              className="min-w-[100px] bg-green-600 hover:bg-green-700"
              disabled={loading || !description.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reactivating...
                </>
              ) : (
                'Reactivate Parcel'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReactivateParcelDialog;
