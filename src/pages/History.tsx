
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Trash2, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const History = () => {
  const [predictions] = useState([
    {
      id: 1,
      date: '2024-06-14',
      time: '14:30',
      class: 2,
      confidence: 65,
      thumbnail: '/placeholder.svg',
      status: 'Moderate NPDR'
    },
    {
      id: 2,
      date: '2024-06-10',
      time: '09:15',
      class: 1,
      confidence: 78,
      thumbnail: '/placeholder.svg',
      status: 'Mild NPDR'
    },
    {
      id: 3,
      date: '2024-06-05',
      time: '16:45',
      class: 0,
      confidence: 92,
      thumbnail: '/placeholder.svg',
      status: 'No DR'
    },
    {
      id: 4,
      date: '2024-05-28',
      time: '11:20',
      class: 3,
      confidence: 56,
      thumbnail: '/placeholder.svg',
      status: 'Severe NPDR'
    }
  ]);

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
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Prediction History
          </h1>
          <p className="text-xl text-slate-300">
            Track your retina analysis results over time
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-100">{predictions.length}</p>
                  <p className="text-slate-400">Total Scans</p>
                </div>
                <Eye className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-100">
                    {predictions.filter(p => p.class === 0).length}
                  </p>
                  <p className="text-slate-400">Normal Results</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-100">
                    {predictions.filter(p => p.class > 0).length}
                  </p>
                  <p className="text-slate-400">Requiring Attention</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prediction List */}
        <div className="space-y-4">
          {predictions.map((prediction) => (
            <Card key={prediction.id} className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg overflow-hidden">
                      <img
                        src={prediction.thumbnail}
                        alt="Retina scan thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={`${getStatusColor(prediction.class)} text-white`}>
                          {getStatusIcon(prediction.class)}
                          <span className="ml-1">{prediction.status}</span>
                        </Badge>
                        <span className="text-slate-400">
                          {prediction.confidence}% confidence
                        </span>
                      </div>
                      
                      <div className="flex items-center text-slate-400 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(prediction.date)} at {prediction.time}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link to={`/prediction/${prediction.id}`}>
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        View Details
                      </Button>
                    </Link>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
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
                          <Button variant="outline" className="border-slate-600 text-slate-300">
                            Cancel
                          </Button>
                          <Button className="bg-red-500 hover:bg-red-600 text-white">
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {predictions.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="py-12 text-center">
              <Eye className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-100 mb-2">No Predictions Yet</h3>
              <p className="text-slate-400 mb-6">Start by uploading your first retina image for analysis</p>
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
