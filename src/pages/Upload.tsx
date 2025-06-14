
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

const Upload = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prediction, setPrediction] = useState({
    class: 2,
    confidences: [5, 15, 65, 12, 3], // Percentages for classes 0-4
    explanation: "The analysis reveals moderate non-proliferative diabetic retinopathy with microaneurysms and dot hemorrhages visible in the central retinal area. The AI model detected characteristic changes in blood vessel patterns consistent with diabetic damage. Early intervention and regular monitoring are recommended to prevent progression."
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
      // Convert confidence percentages to decimals and create scores object
      const confidenceScores = prediction.confidences.reduce((acc, conf, index) => {
        acc[index] = conf / 100;
        return acc;
      }, {} as Record<number, number>);

      const { data, error } = await supabase
        .from('predictions')
        .insert({
          user_id: user.id,
          image_url: uploadedImage,
          gradcam_url: uploadedImage, // Using same image for now, could be actual grad-cam later
          prediction_class: prediction.class,
          confidence_scores: confidenceScores,
          ai_explanation: prediction.explanation
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Prediction saved successfully!",
      });

      // Navigate to the prediction details page
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

    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          startTypingEffect();
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  };

  const startTypingEffect = () => {
    setIsTyping(true);
    const text = prediction.explanation;
    let i = 0;
    
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        setExplanationText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 30);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 50) return 'from-red-500 to-red-600';
    if (confidence > 30) return 'from-orange-500 to-orange-600';
    if (confidence > 15) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
            Retina Analysis
          </h1>
          <p className="text-base text-slate-300">
            Upload your retina image for AI-powered diabetic retinopathy detection
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
                      className="w-full h-40 object-cover rounded-lg"
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
                  <p className="text-center text-slate-400 mt-1 text-xs">{Math.round(progress)}% complete</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          {analysisComplete && (
            <div className="space-y-3">
              {/* Grad-CAM Visualization */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-100">Grad-CAM Visualization</CardTitle>
                  <CardDescription className="text-xs text-slate-300">
                    Areas highlighted in red show regions of concern identified by AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Grad-CAM visualization"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    {/* Overlay to simulate Grad-CAM */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-transparent to-yellow-500/20 rounded-lg mix-blend-multiply" />
                  </div>
                </CardContent>
              </Card>

              {/* Confidence Scores */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-100 flex items-center">
                    Prediction Confidence
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="ml-2 h-3 w-3 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-700 border-slate-600">
                          <div className="space-y-1 text-xs">
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
                <CardContent className="space-y-1">
                  {prediction.confidences.map((confidence, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-300 text-xs">Class {index}: {drClasses[index].name}</span>
                        <span className="text-slate-300 font-semibold text-xs">{confidence}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full bg-gradient-to-r ${getConfidenceColor(confidence)}`}
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* AI Explanation */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-100">AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {explanationText}
                    {isTyping && <span className="animate-pulse">|</span>}
                  </p>
                </CardContent>
              </Card>

              {/* Save and Download Options */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-100">Save & Download</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={savePredictionToDatabase}
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs"
                  >
                    {isSaving ? 'Saving...' : 'Save to History'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 text-xs">
                    <Download className="mr-2 h-3 w-3" />
                    Download Grad-CAM Image (.png)
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 text-xs">
                    <FileText className="mr-2 h-3 w-3" />
                    Download Full Report (.pdf)
                  </Button>
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
