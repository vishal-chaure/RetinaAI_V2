
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Trash2, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Prediction {
  id: string;
  created_at: string;
  prediction_class: number;
  confidence_scores: any;
  image_url: string;
  gradcam_url?: string;
  ai_explanation?: string;
}

const History = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchPredictions();
  }, [user, navigate]);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      toast({
        title: "Error",
        description: "Failed to load prediction history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePrediction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('predictions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPredictions(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Prediction deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting prediction:', error);
      toast({
        title: "Error",
        description: "Failed to delete prediction",
        variant: "destructive",
      });
    }
  };

  const getStatusInfo = (classNum: number) => {
    const statuses = [
      { name: 'No DR', color: 'bg-green-500', icon: TrendingUp },
      { name: 'Mild NPDR', color: 'bg-yellow-500', icon: AlertCircle },
      { name: 'Moderate NPDR', color: 'bg-orange-500', icon: AlertCircle },
      { name: 'Severe NPDR', color: 'bg-red-500', icon: AlertCircle },
      { name: 'PDR', color: 'bg-red-600', icon: AlertCircle }
    ];
    return statuses[classNum] || statuses[0];
  };

  const getConfidence = (confidenceScores: any) => {
    if (!confidenceScores) return 0;
    return Math.max(...Object.values(confidenceScores as { [key: string]: number }));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-14 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Prediction History
          </h1>
          <p className="text-slate-300">
            Track your retina analysis results over time
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-slate-100">{predictions.length}</p>
                  <p className="text-slate-400 text-sm">Total Scans</p>
                </div>
                <Eye className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-slate-100">
                    {predictions.filter(p => p.prediction_class === 0).length}
                  </p>
                  <p className="text-slate-400 text-sm">Normal Results</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-slate-100">
                    {predictions.filter(p => p.prediction_class > 0).length}
                  </p>
                  <p className="text-slate-400 text-sm">Requiring Attention</p>
                </div>
                <AlertCircle className="h-6 w-6 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prediction List */}
        <div className="space-y-3">
          {predictions.map((prediction) => {
            const status = getStatusInfo(prediction.prediction_class);
            const confidence = Math.round(getConfidence(prediction.confidence_scores) * 100);
            const StatusIcon = status.icon;

            return (
              <Card key={prediction.id} className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slate-700 rounded-lg overflow-hidden">
                        <img
                          src={prediction.image_url || '/placeholder.svg'}
                          alt="Retina scan thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={`${status.color} text-white text-xs`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.name}
                          </Badge>
                          <span className="text-slate-400 text-xs">
                            {confidence}% confidence
                          </span>
                        </div>
                        
                        <div className="flex items-center text-slate-400 text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(prediction.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link to={`/prediction/${prediction.id}`}>
                        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs h-8">
                          View Details
                        </Button>
                      </Link>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10 h-8 w-8 p-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-slate-100">Delete Prediction</DialogTitle>
                            <DialogDescription className="text-slate-300">
                              Are you sure you want to delete this prediction? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                              Cancel
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => deletePrediction(prediction.id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {predictions.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="py-8 text-center">
              <Eye className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">No Predictions Yet</h3>
              <p className="text-slate-400 mb-4 text-sm">Start by uploading your first retina image for analysis</p>
              <Link to="/upload">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                  Upload Image
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default History;
