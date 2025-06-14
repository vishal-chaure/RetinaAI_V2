
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Eye, Heart, Shield, ArrowRight, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const eyeHealthTips = [
    {
      title: "Reduce Sugar Intake",
      description: "High blood sugar levels can damage blood vessels in your retina.",
      icon: Heart,
      tip: "Limit processed foods and sugary drinks. Focus on whole grains, lean proteins, and vegetables."
    },
    {
      title: "Regular Eye Checkups",
      description: "Early detection is key to preventing vision loss from diabetic retinopathy.",
      icon: Eye,
      tip: "Schedule comprehensive eye exams at least once a year, or more frequently if recommended by your doctor."
    },
    {
      title: "Control Blood Pressure",
      description: "High blood pressure can worsen diabetic retinopathy and increase your risk of vision problems.",
      icon: Shield,
      tip: "Monitor your blood pressure regularly and follow your doctor's recommendations for medication and lifestyle changes."
    }
  ];

  // Get user's first name from user metadata
  const firstName = user?.user_metadata?.first_name || 'there';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          {user ? (
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
              Welcome back, {firstName}! 👋
            </h1>
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
              AI-Powered Retina Analysis
            </h1>
          )}
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Advanced diabetic retinopathy detection using state-of-the-art AI technology.
          </p>
        </div>

        {/* Quick Upload Card */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-400/30 transition-all duration-300">
            <CardHeader className="text-center pb-3">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-100">Start Your Analysis</CardTitle>
              <CardDescription className="text-slate-300">
                Upload your retina image for instant AI-powered screening
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/upload">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2">
                  Upload Image
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* What is Diabetic Retinopathy Section */}
        <div className="mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-xl text-slate-100 flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-400" />
                What is Diabetic Retinopathy?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Diabetic retinopathy is a serious eye condition that affects people with diabetes. It occurs when high blood sugar levels damage the blood vessels in the retina, potentially leading to vision loss or blindness if left untreated.
              </p>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                    Learn More
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-slate-100">Understanding Diabetic Retinopathy</DialogTitle>
                    <DialogDescription className="text-slate-300">
                      A comprehensive guide to diabetic retinopathy stages and prevention
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-slate-300 text-sm">
                    <div>
                      <h3 className="font-semibold text-blue-400 mb-2">Stages of Diabetic Retinopathy</h3>
                      <ul className="space-y-1 ml-4">
                        <li><strong>Stage 0:</strong> No retinopathy - Normal retina</li>
                        <li><strong>Stage 1:</strong> Mild NPDR - Small areas of swelling in retinal blood vessels</li>
                        <li><strong>Stage 2:</strong> Moderate NPDR - Blood vessels become blocked</li>
                        <li><strong>Stage 3:</strong> Severe NPDR - More blood vessels are blocked</li>
                        <li><strong>Stage 4:</strong> PDR - New abnormal blood vessels grow</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-400 mb-2">Prevention Tips</h3>
                      <ul className="space-y-1 ml-4">
                        <li>• Maintain good blood sugar control</li>
                        <li>• Schedule regular comprehensive eye exams</li>
                        <li>• Keep blood pressure and cholesterol in check</li>
                        <li>• Don't smoke</li>
                        <li>• Exercise regularly</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Eye Health Tips */}
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4 text-center">
            Eye Health Tips
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {eyeHealthTips.map((tip, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <tip.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg text-slate-100">{tip.title}</CardTitle>
                  <CardDescription className="text-slate-300 text-sm">
                    {tip.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {tip.tip}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
