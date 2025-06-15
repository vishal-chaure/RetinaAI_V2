import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Eye, Heart, Shield, ArrowRight, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeModal from '@/components/WelcomeModal';
import { LampContainer } from '@/components/ui/lamp';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';

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

  const drLevels = [
    {
      quote:
        "Your retina looks completely healthy with no signs of damage. Blood vessels in your eyes are normal, and there is no risk of vision problems right now. This means your diabetes is well managed",
      name: "Level 0",
      designation: "No Diabetic Retinopathy",
      src: "/level 0.png",
    },
    {
      quote:
        "Very early stage of diabetic eye disease. Tiny balloon-like swellings (microaneurysms) appear in the blood vessels of the retina. You likely won't notice any symptoms at this stage, but it's a sign to keep sugar levels under control.",
      name: "Level 1",
      designation: "Mild Diabetic Retinopathy",
      src: "/level 1.png",
    },
    {
      quote:
        "The damage is getting worse. More blood vessels are leaking or becoming blocked. Some blurry vision may start. Regular monitoring and good blood sugar control are important to slow down the disease.",
      name: "Level 2",
      designation: "Moderate Diabetic Retinopathy",
      src: "/level 2.png",
    },
    {
      quote:
        "Many blood vessels are damaged and closed. The retina is not getting enough oxygen-rich blood. This stage is more serious, and you may start to lose vision. Eye treatments may soon be needed to prevent blindness.",
      name: "Level 3",
      designation: "Severe Diabetic Retinopathy",
      src: "/level 3.png",
    },
    {
      quote:
        "Most advanced and dangerous stage. New, fragile blood vessels grow inside the retina, which can bleed and cause permanent vision loss. Immediate treatment like laser therapy or injections is often required to protect sight.",
      name: "Level 4",
      designation: "Proliferative Diabetic Retinopathy",
      src: "/level 4.png",
    },
  ];

  // Get user's first name from user metadata
  const firstName = user?.user_metadata?.first_name || 'there';

  return (
    <div className="min-h-screen bg-gradient-to-br  pt-14">
      {/* <WelcomeModal /> */}


      <div className=" mx-auto">
    <LampContainer>
        {/* Welcome Section */}
        
        <div className="text-center my-3  animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent mb-2">
            AI-Powered Retina Analysis
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl my-5 mx-auto">
            Advanced diabetic retinopathy detection using state-of-the-art AI technology.
          </p>
        </div>

        {/* Minimized Quick Upload Card */}
        <div className="mb-6 max-w-md my-20 mx-auto animate-fade-in">
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-400/30 transition-all duration-300">
            <CardHeader className="text-center pb-2">
              {/* <div className="mx-auto w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-2">
                <Upload className="h-4 w-4 text-white" />
              </div> */}
              <CardTitle className="text-base text-slate-100">Start Analysis</CardTitle>
              <CardDescription className="text-xs text-slate-300">
                Upload retina image for AI screening
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/upload">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-1 text-xs hover:scale-105 transition-transform duration-200">
                  Upload Image
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </LampContainer>
      </div>



      <div className="max-w-6xl my-40 mx-auto px-8 sm:px-10 lg:px-12 py-6">
        {/* What is Diabetic Retinopathy Section */}
        <div className="mb-6 animate-fade-in">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100 flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-400" />
                What is Diabetic Retinopathy?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-3 leading-relaxed text-sm">
                Diabetic retinopathy is a serious eye condition that affects people with diabetes. It occurs when high blood sugar levels damage the delicate blood vessels in the retina – the light-sensitive tissue at the back of the eye that is essential for good vision.
              </p>
              <p className="text-slate-300 mb-3 leading-relaxed text-sm">
                Initially, these damaged blood vessels may swell and leak fluid or bleed. In more advanced stages, the eye tries to grow new, abnormal blood vessels on the surface of the retina and into the vitreous gel that fills the eye. These new vessels are fragile and can easily bleed, leading to severe vision problems or even a detached retina.
              </p>
              <p className="text-slate-300 leading-relaxed text-sm">
                Without early detection and timely treatment, diabetic retinopathy can progressively worsen and lead to permanent vision loss or blindness. Regular dilated eye exams are crucial for people with diabetes to detect and manage this condition effectively.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>


        {/* Eye Health Tips
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-100 mb-3 text-center">
            Eye Health Tips
          </h2>
          <div className="grid md:grid-cols-3 gap-3">
            {eyeHealthTips.map((tip, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02] group h-full animate-fade-in">
                <CardHeader className="pb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-2">
                    <tip.icon className="h-4 w-4 text-white" />
                  </div>
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
            ))}
          </div>
        </div> */}



        <AnimatedTestimonials testimonials={drLevels} />

        {/* How Does AI Detect DR Section */}
        {/* <div className="mb-6 animate-fade-in">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100 flex items-center">
                <Info className="mr-2 h-5 w-5 text-cyan-400" />
                How Does AI Detect Diabetic Retinopathy?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed text-sm">
                Our AI model analyzes retina images to detect signs of diabetic retinopathy automatically. It provides fast, accurate screening by identifying patterns and features in the retina that may indicate disease, helping with early detection and treatment.
              </p>
            </CardContent>
          </Card>
        </div> */}

        {/* What is Grad-CAM Section */}
        {/* <div className="mb-6 animate-fade-in">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100 flex items-center">
                <Info className="mr-2 h-5 w-5 text-pink-400" />
                What is Grad-CAM?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed text-sm">
                Grad-CAM (Gradient-weighted Class Activation Mapping) is a visualization technique that highlights the regions of an image most important for a model's prediction. It helps users and clinicians understand what the AI is focusing on, adding transparency and trust to the diagnosis.
              </p>
            </CardContent>
          </Card>
        </div> */}

        {/* Technologies Used Section */}
        {/* <div className="mb-6 animate-fade-in">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100 flex items-center">
                <Info className="mr-2 h-5 w-5 text-green-400" />
                Technologies Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-slate-300 text-sm list-disc ml-6 space-y-1">
                <li><b>Flask (Python):</b> Backend server for AI predictions</li>
                <li><b>React + Vite + TypeScript:</b> Modern frontend for a fast, interactive UI</li>
                <li><b>Supabase:</b> Authentication and prediction history storage</li>
                <li><b>Tailwind CSS:</b> Utility-first CSS for rapid UI development</li>
                <li><b>Lucide Icons:</b> Modern icon library</li>
                <li><b>AI Model:</b> Deep learning for DR classification</li>
                <li><b>Grad-CAM:</b> Visual explanations for predictions</li>
              </ul>
            </CardContent>
          </Card>
        </div> */}

        {/* How It Works Section */}
        {/* <div className="mb-6 animate-fade-in">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100 flex items-center">
                <Info className="mr-2 h-5 w-5 text-yellow-400" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="text-slate-300 text-sm list-decimal ml-6 space-y-1">
                <li>Upload a retina image</li>
                <li>AI analyzes the image and predicts the DR stage</li>
                <li>Confidence scores for each class are provided</li>
                <li>AI generates a human-readable explanation</li>
                <li>Grad-CAM highlights important regions in the image</li>
                <li>Users can save and view their prediction history</li>
              </ol>
            </CardContent>
          </Card>
        </div> */}

        {/* Why Use This App Section */}
        {/* <div className="mb-6 animate-fade-in">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100 flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-400" />
                Why Use This App?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-slate-300 text-sm list-disc ml-6 space-y-1">
                <li><b>Early Detection:</b> Helps in early diagnosis of diabetic retinopathy</li>
                <li><b>Educational:</b> Learn about AI, DR, and modern healthcare technology</li>
                <li><b>Transparency:</b> Visual explanations (Grad-CAM) build trust in AI predictions</li>
                <li><b>User-Friendly:</b> Simple upload and instant results</li>
              </ul>
            </CardContent>
          </Card>
        </div> */}
      
    </div>
  );
};

export default Dashboard;
