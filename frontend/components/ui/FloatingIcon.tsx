"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FloatingIconProps {
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

export const FloatingIcon = ({ icon: Icon, className = "", delay = 0 }: FloatingIconProps) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    animate={{ 
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{ 
      duration: 4, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut" 
    }}
  >
    <Icon className="w-6 h-6 opacity-30" />
  </motion.div>
);
