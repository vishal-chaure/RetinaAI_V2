
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && !hasShownWelcome) {
      setIsOpen(true);
      setHasShownWelcome(true);
      
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user, hasShownWelcome]);

  const firstName = user?.user_metadata?.first_name || 'there';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <DialogTitle className="text-xl text-slate-100 text-center">
              Welcome back, {firstName}! 👋
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-center mt-2">
              Ready to analyze some retina images today?
            </DialogDescription>
          </motion.div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
