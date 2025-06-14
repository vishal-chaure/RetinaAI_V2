
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, FileText, Calendar, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PredictionDetails = () => {
  const { id } = useParams();
  
  // Mock data - in real app this would come from API/database
  const prediction = {
    id: id,
    date: '2024-06-14',
    time: '14:30',
    class: 2,
    confidences: [5, 15, 65, 12, 3],
    originalImage: '/placeholder.svg',
    gradcamImage: '/placeholder.svg',
    status: 'Moderate NPDR',
    explanation: "The analysis reveals moderate non-proliferative diabetic retinopathy with microaneurysms and dot hemorrhages visible in the central retinal area. The AI model detected characteristic changes in blood vessel patterns consistent with diabetic damage. Early intervention and regular monitoring are recommended to prevent progression. The presence of hard exudates and cotton wool spots indicates ongoing vascular compromise that requires clinical attention."
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 50) return 'from-red-500 to-red-600';
    if (confidence > 30) return 'from-orange-500 to-orange-600';
    if (confidence > 15) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16">
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
                {formatDate(prediction.date)} at {prediction.time}
              </div>
            </div>
          </div>
          
          <Badge className={`${getStatusColor(prediction.class)} text-white px-4 py-2`}>
            {getStatusIcon(prediction.class)}
            <span className="ml-2">{prediction.status}</span>
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
                  src={prediction.originalImage}
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
                <div className="relative">
                  <img
                    src={prediction.gradcamImage}
                    alt="Grad-CAM visualization"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {/* Overlay to simulate Grad-CAM */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-transparent to-yellow-500/20 rounded-lg mix-blend-multiply" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {/* Confidence Scores */}
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
              <CardContent className="space-y-3">
                {prediction.confidences.map((confidence, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-300">Class {index}: {drClasses[index].name}</span>
                      <span className="text-slate-300 font-semibold">{confidence}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${getConfidenceColor(confidence)}`}
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
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
                  {prediction.explanation}
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
                <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download Original Image (.jpg)
                </Button>
                <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download Grad-CAM Image (.png)
                </Button>
                <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
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
