import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload as UploadIcon, Image, Download, FileText, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// const API_URL = 'https://retinaaibackend-production-872b.up.railway.app';
const API_URL = 'https://retinaaibackend-production-5216.up.railway.app';

const Upload = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prediction, setPrediction] = useState({
    class: 0,
    confidences: [0, 0, 0, 0, 0],
    explanation: "",
    gradcam_image: ""
  });
  const [explanationText, setExplanationText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const drClasses = [
    { name: "No DR", description: "No signs of diabetic retinopathy" },
    { name: "Mild NPDR", description: "Mild non-proliferative diabetic retinopathy" },
    { name: "Moderate NPDR", description: "Moderate non-proliferative diabetic retinopathy" },
    { name: "Severe NPDR", description: "Severe non-proliferative diabetic retinopathy" },
    { name: "PDR", description: "Proliferative diabetic retinopathy" }
  ];

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setAnalysisComplete(false);
      setExplanationText('');
    };
    reader.readAsDataURL(file);
  };

  const savePredictionToDatabase = async () => {
    if (!user || !uploadedImage) {
      toast({
        title: "Error",
        description: "Please log in to save predictions",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from('predictions')
        .insert({
          user_id: user.id,
          image_url: uploadedImage,
          gradcam_url: prediction.gradcam_image,
          prediction_class: prediction.class,
          confidence_scores: prediction.confidences.reduce((acc, conf, index) => {
            acc[index] = conf;
            return acc;
          }, {} as Record<number, number>),
          ai_explanation: prediction.explanation
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Prediction saved successfully!",
      });

      navigate(`/prediction/${data.id}`);
    } catch (error) {
      console.error('Error saving prediction:', error);
      toast({
        title: "Error",
        description: "Failed to save prediction",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const startAnalysis = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to analyze images",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!uploadedImage) {
      toast({
        title: "Error",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: uploadedImage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      
      setPrediction({
        class: result.prediction_class,
        confidences: Object.values(result.confidence_scores || {}),
        explanation: result.explanation,
        gradcam_image: result.gradcam_image
      });
      
      setAnalysisComplete(true);
      startTypingEffect(result.explanation);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
      setAnalysisComplete(false);
    } finally {
      setIsAnalyzing(false);
      setProgress(100);
    }
  };

  const startTypingEffect = (text: string) => {
    setIsTyping(true);
    let i = 0;
    
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        setExplanationText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 10);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.5) return 'from-red-500 to-red-600';
    if (confidence > 0.3) return 'from-orange-500 to-orange-600';
    if (confidence > 0.15) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
            Retina Analysis
          </h1>
          <p className="text-base text-slate-300">
            Upload your retina image for ML-powered diabetic retinopathy detection
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Upload Section */}
          <div className="space-y-3">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-100">Upload Image</CardTitle>
                <CardDescription className="text-xs text-slate-300">
                  Drag and drop your retina image or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-blue-500/50 transition-colors duration-300 cursor-pointer"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <UploadIcon className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-slate-300 text-sm mb-1">Drop your image here</p>
                    <p className="text-slate-400 text-xs">or click to browse files</p>
                  </label>
                </div>
              </CardContent>
            </Card>

            {uploadedImage && (
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-100">Image Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded retina"
                      className="w-full h-40 object-contain rounded-lg bg-slate-900/50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                  </div>
                  {!analysisComplete && (
                    <Button
                      onClick={startAnalysis}
                      disabled={isAnalyzing}
                      className="w-full mt-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Start Prediction'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {isAnalyzing && (
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="pt-3">
                  <div className="text-center mb-2">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-slate-300 text-xs">Analyzing retina image...</p>
                  </div>
                  <Progress value={progress} className="w-full" />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          {analysisComplete && (
            <div className="space-y-3">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-100">Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-200 mb-2">Prediction</h3>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-lg font-semibold text-white">
                          {drClasses[prediction.class].name}
                        </p>
                        <p className="text-sm text-slate-300">
                          {drClasses[prediction.class].description}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-200 mb-2">Confidence Scores</h3>
                      <div className="space-y-2">
                        {prediction.confidences.map((confidence, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-24 text-sm text-slate-300">
                              {drClasses[index].name}
                            </div>
                            <div className="flex-1">
                              <div className="h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${getConfidenceColor(confidence)}`}
                                  style={{ width: `${confidence * 100}%` }}
                                />
                              </div>
                            </div>
                            <div className="w-12 text-right text-sm text-slate-300">
                              {(confidence * 100).toFixed(1)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-200 mb-2">AI Explanation</h3>
                      <div className="bg-slate-700/50 rounded-lg p-3 animate-fade-in">
                        <p className="text-sm text-slate-300 whitespace-pre-line">
                          {explanationText}
                          {isTyping && <span className="animate-pulse">|</span>}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-200 mb-2">Grad-CAM Visualization</h3>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <img
                          src={prediction.gradcam_image}
                          alt="Grad-CAM visualization"
                          className="w-full rounded-lg"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={savePredictionToDatabase}
                      disabled={isSaving}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    >
                      {isSaving ? 'Saving...' : 'Save Prediction'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
