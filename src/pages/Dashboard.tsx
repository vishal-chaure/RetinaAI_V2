
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Eye, Heart, Shield, ArrowRight, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import WelcomeModal from '@/components/WelcomeModal';

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
      <WelcomeModal />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {user ? (
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Welcome back, {firstName}! 👋
              </h1>
            ) : (
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                AI-Powered Retina Analysis
              </h1>
            )}
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base text-slate-300 max-w-2xl mx-auto"
          >
            Advanced diabetic retinopathy detection using state-of-the-art AI technology.
          </motion.p>
        </div>

        {/* Minimized Quick Upload Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mb-6 max-w-md mx-auto"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-400/30 transition-all duration-300">
            <CardHeader className="text-center pb-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="mx-auto w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-2"
              >
                <Upload className="h-4 w-4 text-white" />
              </motion.div>
              <CardTitle className="text-base text-slate-100">Start Analysis</CardTitle>
              <CardDescription className="text-xs text-slate-300">
                Upload retina image for AI screening
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/upload">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-1 text-xs">
                    Upload Image
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </motion.div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* What is Diabetic Retinopathy Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="mb-6"
        >
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100 flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-400" />
                What is Diabetic Retinopathy?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-3 leading-relaxed text-sm">
                Diabetic retinopathy is a serious eye condition that affects people with diabetes. It occurs when high blood sugar levels damage the blood vessels in the retina, potentially leading to vision loss or blindness if left untreated.
              </p>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-xs">
                    Learn More
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg text-slate-100">Understanding Diabetic Retinopathy</DialogTitle>
                    <DialogDescription className="text-slate-300 text-sm">
                      A comprehensive guide to diabetic retinopathy stages and prevention
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 text-slate-300 text-xs">
                    <div>
                      <h3 className="font-semibold text-blue-400 mb-1 text-sm">Stages of Diabetic Retinopathy</h3>
                      <ul className="space-y-1 ml-4">
                        <li><strong>Stage 0:</strong> No retinopathy - Normal retina</li>
                        <li><strong>Stage 1:</strong> Mild NPDR - Small areas of swelling in retinal blood vessels</li>
                        <li><strong>Stage 2:</strong> Moderate NPDR - Blood vessels become blocked</li>
                        <li><strong>Stage 3:</strong> Severe NPDR - More blood vessels are blocked</li>
                        <li><strong>Stage 4:</strong> PDR - New abnormal blood vessels grow</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-400 mb-1 text-sm">Prevention Tips</h3>
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
        </motion.div>

        {/* Eye Health Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-xl font-bold text-slate-100 mb-3 text-center">
            Eye Health Tips
          </h2>
          <div className="grid md:grid-cols-3 gap-3">
            {eyeHealthTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group h-full">
                  <CardHeader className="pb-2">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-2"
                    >
                      <tip.icon className="h-4 w-4 text-white" />
                    </motion.div>
                    <CardTitle className="text-base text-slate-100">{tip.title}</CardTitle>
                    <CardDescription className="text-slate-300 text-xs">
                      {tip.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {tip.tip}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
