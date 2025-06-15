import React from 'react';
import { Heart, Github, Twitter, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-slate-900/50 border-t border-slate-800 mt-auto ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-1 md:col-span-2"
          >
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              RetinaAI
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Advanced AI-powered diabetic retinopathy detection system. 
              Helping protect vision through early detection and screening.
            </p>
            <div className="flex items-center text-slate-400 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400 mx-1" />
              <span>for better healthcare</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold text-slate-200 mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/upload" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                  Upload Image
                </a>
              </li>
              <li>
                <a href="/history" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                  History
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold text-slate-200 mb-3">Connect</h4>
            <div className="flex space-x-3">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/vishal-chaure" // <--- Replace with your GitHub URL
                target="_blank" // Opens in a new tab
                rel="noopener noreferrer" // Security best practice for target="_blank"
                className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-colors"
              >
                <Github className="h-4 w-4 text-slate-400 hover:text-blue-400" />
              </motion.a>
              {/* <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://twitter.com/your-twitter-handle" // <--- Replace with your Twitter URL
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-colors"
              >
                <Twitter className="h-4 w-4 text-slate-400 hover:text-blue-400" />
              </motion.a> */}
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:vishal.chaure22@spit.ac.in" // <--- Replace with your email address
                className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-colors"
              >
                <Mail className="h-4 w-4 text-slate-400 hover:text-blue-400" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-slate-800 mt-8 pt-6 text-center"
        >
          <p className="text-slate-500 text-sm">
            © 2024 RetinaAI. All rights reserved. | 
            <span className="text-slate-400 ml-1">
              For educational and research purposes only
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;