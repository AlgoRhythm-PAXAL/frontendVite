import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Brain, TrendingUp, AlertTriangle, Lightbulb, Star, Target, BarChart3 } from 'lucide-react';
import { reportApi } from '@/api/reportApi';

const AIReport = ({ reportData, reportType, filters }) => {
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAIInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await reportApi.getAIInsights(reportData, reportType);
      setAiInsights(response.data.aiInsights);
    } catch (err) {
      console.error('Error generating AI insights:', err);
      setError('Failed to generate AI insights. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [reportData, reportType]);

  // Generate AI insights when component mounts or data changes
  useEffect(() => {
    if (reportData && Object.keys(reportData).length > 0) {
      generateAIInsights();
    }
  }, [reportData, reportType, generateAIInsights]);

  const generateFullAIReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await reportApi.generateAIReport({
        reportType,
        dateRange: filters.dateRange,
        branchId: filters.branchId
      });
      setAiInsights(response.data.aiInsights);
    } catch (err) {
      console.error('Error generating full AI report:', err);
      setError('Failed to generate comprehensive AI report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'operational': return <Target className="h-4 w-4" />;
      case 'financial': return <TrendingUp className="h-4 w-4" />;
      case 'strategic': return <Brain className="h-4 w-4" />;
      case 'customer service': return <Star className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Generating AI insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          {error}
          <Button onClick={generateAIInsights} size="sm" variant="outline">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!aiInsights) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Report Analysis
              </CardTitle>
              <CardDescription>
                Get intelligent insights and recommendations based on your data
              </CardDescription>
            </div>
            <Button onClick={generateFullAIReport} className="ml-4">
              Generate AI Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Click &quot;Generate AI Report&quot; to get intelligent analysis of your data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Regenerate Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI Analysis Results
              </CardTitle>
              <CardDescription>
                Intelligent insights generated at {new Date().toLocaleString()}
              </CardDescription>
            </div>
            <Button onClick={generateAIInsights} variant="outline" size="sm">
              <Brain className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Executive Summary */}
      {aiInsights.executiveSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              {aiInsights.executiveSummary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Performance Score */}
      {aiInsights.performanceScore && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {aiInsights.performanceScore.overall}%
                </div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <Progress value={aiInsights.performanceScore.overall} className="mt-2" />
              </div>
              {Object.entries(aiInsights.performanceScore.breakdown || {}).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-semibold mb-1">{value}%</div>
                  <p className="text-sm text-muted-foreground capitalize">{key}</p>
                  <Progress value={value} className="mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabbed Content */}
      <Tabs defaultValue="findings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="findings">Key Findings</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        {/* Key Findings */}
        <TabsContent value="findings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Findings</CardTitle>
              <CardDescription>Important insights from your data analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {aiInsights.keyFindings?.length > 0 ? (
                <div className="space-y-3">
                  {aiInsights.keyFindings.map((finding, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm">{finding}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specific findings available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Actionable suggestions to improve performance</CardDescription>
            </CardHeader>
            <CardContent>
              {aiInsights.recommendations?.length > 0 ? (
                <div className="space-y-4">
                  {aiInsights.recommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(rec.category)}
                          <h4 className="font-semibold">{rec.title}</h4>
                        </div>
                        <Badge variant={getPriorityColor(rec.priority)}>
                          {rec.priority} Priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium">Expected Impact:</span> {rec.expectedImpact}
                        </div>
                        <div>
                          <span className="font-medium">Timeframe:</span> {rec.timeframe}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specific recommendations available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Assessment */}
        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Risk Assessment
              </CardTitle>
              <CardDescription>Potential risks and mitigation strategies</CardDescription>
            </CardHeader>
            <CardContent>
              {aiInsights.riskAssessment ? (
                <div className="space-y-4">
                  {aiInsights.riskAssessment.highRisks?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-600 mb-2">High Risks</h4>
                      <ul className="space-y-1">
                        {aiInsights.riskAssessment.highRisks.map((risk, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {aiInsights.riskAssessment.mediumRisks?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-orange-600 mb-2">Medium Risks</h4>
                      <ul className="space-y-1">
                        {aiInsights.riskAssessment.mediumRisks.map((risk, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiInsights.riskAssessment.mitigationStrategies?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">Mitigation Strategies</h4>
                      <ul className="space-y-2">
                        {aiInsights.riskAssessment.mitigationStrategies.map((strategy, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <span>{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No risk assessment available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opportunities */}
        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Growth Opportunities
              </CardTitle>
              <CardDescription>Potential areas for business growth and improvement</CardDescription>
            </CardHeader>
            <CardContent>
              {aiInsights.opportunities?.length > 0 ? (
                <div className="space-y-4">
                  {aiInsights.opportunities.map((opportunity, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-yellow-50/50">
                      <h4 className="font-semibold text-yellow-800 mb-2">{opportunity.area}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{opportunity.description}</p>
                      <div className="text-xs">
                        <span className="font-medium text-green-600">Potential Impact:</span>{' '}
                        <span className="text-muted-foreground">{opportunity.potentialImpact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specific opportunities identified.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Raw Text Response (if available) */}
      {aiInsights.textResponse && (
        <Card>
          <CardHeader>
            <CardTitle>Additional AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{aiInsights.textResponse}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

AIReport.propTypes = {
  reportData: PropTypes.object,
  reportType: PropTypes.string,
  filters: PropTypes.shape({
    dateRange: PropTypes.object,
    branchId: PropTypes.string
  })
};

AIReport.defaultProps = {
  reportData: {},
  reportType: 'comprehensive',
  filters: {
    dateRange: null,
    branchId: 'all'
  }
};

export default AIReport;
