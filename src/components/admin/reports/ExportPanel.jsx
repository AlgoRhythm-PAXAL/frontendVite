import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  FileText, 
  Table, 
  Brain, 
  Loader2,
  Check,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { reportApi } from '@/api/reportApi';
import { toast } from 'sonner';

const ExportPanel = ({ reportType, filters, onExportComplete }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includeAI, setIncludeAI] = useState(false);
  const [exportHistory, setExportHistory] = useState([]);

  const handleExport = async (format = exportFormat) => {
    setIsExporting(true);
    
    try {
      let blob;
      let filename;
      
      const exportParams = {
        reportType,
        dateRange: filters?.dateRange,
        branchId: filters?.branchId || 'all',
        includeAI: includeAI.toString()
      };

      if (format === 'pdf') {
        blob = await reportApi.exportPDF(exportParams);
        filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`;
      } else if (format === 'csv') {
        blob = await reportApi.exportCSV(exportParams);
        filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      // Update export history
      const exportRecord = {
        id: Date.now(),
        format: format.toUpperCase(),
        filename,
        timestamp: new Date().toLocaleString(),
        size: blob.size,
        includeAI
      };
      
      setExportHistory(prev => [exportRecord, ...prev.slice(0, 4)]);
      
      toast.success(`${format.toUpperCase()} export completed successfully!`);
      
      if (onExportComplete) {
        onExportComplete(exportRecord);
      }

    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Failed to export ${format.toUpperCase()}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDataExport = async (dataType) => {
    setIsExporting(true);
    
    try {
      const blob = await reportApi.exportDataCSV(dataType, {
        filters: filters ? {
          createdAt: filters.dateRange ? {
            $gte: filters.dateRange.startDate,
            $lte: filters.dateRange.endDate
          } : undefined,
          branch: filters.branchId !== 'all' ? filters.branchId : undefined
        } : {},
        limit: 5000
      });

      const filename = `${dataType}_data_${new Date().toISOString().split('T')[0]}.csv`;
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} data exported successfully!`);

    } catch (error) {
      console.error('Data export failed:', error);
      toast.error(`Failed to export ${dataType} data. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFormatIcon = (format) => {
    switch (format?.toLowerCase()) {
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'csv': return <FileSpreadsheet className="h-4 w-4" />;
      default: return <Download className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Professional Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Professional Report Export
          </CardTitle>
          <CardDescription>
            Generate professionally formatted reports with your organization&apos;s branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format-select">Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="format-select">
                <SelectValue placeholder="Choose export format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="font-medium">PDF Report</div>
                      <div className="text-xs text-muted-foreground">Professional formatting with charts</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    <div>
                      <div className="font-medium">CSV Data</div>
                      <div className="text-xs text-muted-foreground">Raw data for analysis</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Insights Option */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="include-ai" 
              checked={includeAI}
              onCheckedChange={setIncludeAI}
            />
            <Label htmlFor="include-ai" className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-500" />
              Include AI Insights & Recommendations
            </Label>
          </div>

          {/* Export Information */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {exportFormat === 'pdf' ? (
                <>Professional PDF with company branding, charts, and formatted tables. 
                {includeAI && ' Includes AI-powered insights and recommendations.'}</>
              ) : (
                <>Structured CSV data suitable for spreadsheet analysis and further processing.
                {includeAI && ' Includes AI insights in additional sections.'}</>
              )}
            </AlertDescription>
          </Alert>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={() => handleExport(exportFormat)}
              disabled={isExporting}
              className="flex-1"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                getFormatIcon(exportFormat)
              )}
              {isExporting ? 'Generating...' : `Export ${exportFormat.toUpperCase()}`}
            </Button>
            
            {exportFormat !== 'pdf' && (
              <Button 
                variant="outline"
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            )}
            
            {exportFormat !== 'csv' && (
              <Button 
                variant="outline"
                onClick={() => handleExport('csv')}
                disabled={isExporting}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            Raw Data Export
          </CardTitle>
          <CardDescription>
            Export specific data types as CSV for detailed analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { id: 'parcels', label: 'Parcels', desc: 'Parcel records' },
              { id: 'users', label: 'Users', desc: 'User accounts' },
              { id: 'payments', label: 'Payments', desc: 'Payment records' },
              { id: 'branches', label: 'Branches', desc: 'Branch data' },
              { id: 'shipments', label: 'Shipments', desc: 'B2B shipments' }
            ].map((dataType) => (
              <Button
                key={dataType.id}
                variant="outline"
                size="sm"
                onClick={() => handleDataExport(dataType.id)}
                disabled={isExporting}
                className="h-auto flex-col items-start p-3 text-left"
              >
                <div className="flex items-center gap-2 w-full">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="font-medium">{dataType.label}</span>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {dataType.desc}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      {exportHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Recent Exports
            </CardTitle>
            <CardDescription>
              Your recent export history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exportHistory.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFormatIcon(record.format)}
                    <div>
                      <div className="font-medium text-sm">{record.filename}</div>
                      <div className="text-xs text-muted-foreground">
                        {record.timestamp} • {formatFileSize(record.size)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{record.format}</Badge>
                    {record.includeAI && (
                      <Badge variant="outline" className="text-blue-600">
                        <Brain className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

ExportPanel.propTypes = {
  reportType: PropTypes.string.isRequired,
  filters: PropTypes.shape({
    dateRange: PropTypes.object,
    branchId: PropTypes.string
  }),
  onExportComplete: PropTypes.func
};

ExportPanel.defaultProps = {
  filters: {},
  onExportComplete: null
};

export default ExportPanel;
