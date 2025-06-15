import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, FileText, Calendar, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Prediction {
  id: string;
  created_at: string;
  prediction_class: number;
  confidence_scores: any;
  image_url: string;
  gradcam_url: string;
  ai_explanation: string;
  user_id: string;
}

const PredictionDetails = () => {
  const { id } = useParams();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchPredictionDetails();
  }, [id, user, navigate]);

  const fetchPredictionDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPrediction(data);
    } catch (error) {
      console.error('Error fetching prediction details:', error);
      toast({
        title: "Error",
        description: "Failed to load prediction details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const drClasses = [
    { name: "No DR", description: "No signs of diabetic retinopathy" },
    { name: "Mild NPDR", description: "Mild non-proliferative diabetic retinopathy" },
    { name: "Moderate NPDR", description: "Moderate non-proliferative diabetic retinopathy" },
    { name: "Severe NPDR", description: "Severe non-proliferative diabetic retinopathy" },
    { name: "PDR", description: "Proliferative diabetic retinopathy" }
  ];

  const getStatusColor = (classNum: number) => {
    switch (classNum) {
      case 0: return 'bg-green-500';
      case 1: return 'bg-yellow-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-red-500';
      case 4: return 'bg-red-600';
      default: return 'bg-slate-500';
    }
  };

  const getStatusIcon = (classNum: number) => {
    if (classNum === 0) return <TrendingUp className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async (type: 'original' | 'gradcam' | 'report') => {
    if (!prediction) return;

    try {
      let url: string;
      let filename: string;

      switch (type) {
        case 'original':
          url = prediction.image_url;
          filename = `retina-scan-${prediction.id}.jpg`;
          break;
        case 'gradcam':
          url = prediction.gradcam_url;
          filename = `gradcam-${prediction.id}.png`;
          break;
        case 'report':
          // Generate PDF report
          const reportData = {
            date: formatDate(prediction.created_at),
            class: drClasses[prediction.prediction_class].name,
            confidence: `${(prediction.confidence_scores[prediction.prediction_class] * 100).toFixed(2)}%`,
            explanation: prediction.ai_explanation
          };
          // TODO: Implement PDF generation
          toast({
            title: "Coming Soon",
            description: "PDF report generation will be available soon",
          });
          return;
      }

      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16 flex items-center justify-center">
        <div className="text-slate-300">Prediction not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/history">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Prediction Details
              </h1>
              <div className="flex items-center text-slate-400 mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(prediction.created_at)}
              </div>
            </div>
          </div>
          
          <Badge className={`${getStatusColor(prediction.prediction_class)} text-white px-4 py-2`}>
            {getStatusIcon(prediction.prediction_class)}
            <span className="ml-2">{drClasses[prediction.prediction_class].name}</span>
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-xl text-slate-100">Original Image</CardTitle>
                <CardDescription className="text-slate-300">
                  The uploaded retina fundus image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={prediction.image_url}
                  alt="Original retina image"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-xl text-slate-100">Grad-CAM Visualization</CardTitle>
                <CardDescription className="text-slate-300">
                  AI attention map highlighting areas of concern
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={prediction.gradcam_url}
                  alt="Grad-CAM visualization"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {/* Confidence Score */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-xl text-slate-100 flex items-center">
                  Prediction Confidence
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="ml-2 h-4 w-4 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-700 border-slate-600">
                        <div className="space-y-1 text-sm">
                          {drClasses.map((cls, index) => (
                            <div key={index}>
                              <strong>Class {index}:</strong> {cls.description}
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300">
                    {drClasses[prediction.prediction_class].name}
                  </span>
                  <span className="text-slate-300 font-semibold">
                    {(prediction.confidence_scores[prediction.prediction_class] * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      prediction.confidence_scores[prediction.prediction_class] >= 0.8 ? 'from-green-500 to-green-600' :
                      prediction.confidence_scores[prediction.prediction_class] >= 0.6 ? 'from-yellow-500 to-yellow-600' :
                      'from-red-500 to-red-600'
                    }`}
                    style={{ width: `${prediction.confidence_scores[prediction.prediction_class] * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI Explanation */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-xl text-slate-100">Detailed Analysis</CardTitle>
                <CardDescription className="text-slate-300">
                  AI-generated interpretation of the findings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">
                  {prediction.ai_explanation}
                </p>
              </CardContent>
            </Card>

            {/* Download Options */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-xl text-slate-100">Download Results</CardTitle>
                <CardDescription className="text-slate-300">
                  Save your analysis results for future reference
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => handleDownload('original')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Original Image (.jpg)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => handleDownload('gradcam')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Grad-CAM Image (.png)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => handleDownload('report')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Download Full Report (.pdf)
                </Button>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-slate-100">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-300">
                  <li>• Consult with an ophthalmologist for professional evaluation</li>
                  <li>• Schedule regular follow-up examinations</li>
                  <li>• Maintain good blood sugar control</li>
                  <li>• Monitor blood pressure regularly</li>
                  <li>• Consider lifestyle modifications as recommended by your healthcare provider</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetails;
