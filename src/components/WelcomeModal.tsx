
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const WelcomeModal = () => {
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !hasShownWelcome) {
      const firstName = user?.user_metadata?.first_name || 'there';
      
      toast({
        title: `Welcome back, ${firstName}! 👋`,
        description: "Ready to analyze some retina images today?",
        duration: 3000,
      });
      
      setHasShownWelcome(true);
    }
  }, [user, hasShownWelcome, toast]);

  return null; // No UI to render, just the toast logic
};

export default WelcomeModal;
