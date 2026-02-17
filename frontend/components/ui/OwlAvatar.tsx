"use client";

import { motion } from "framer-motion";

interface OwlAvatarProps {
  size?: number;
  isAnimated?: boolean;
}

export const OwlAvatar = ({ size = 48, isAnimated = true }: OwlAvatarProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    animate={isAnimated ? { rotate: [0, 5, -5, 0] } : {}}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  >
    {/* Body */}
    <ellipse cx="50" cy="60" rx="38" ry="35" fill="#5BC0DE" />
    {/* Wings */}
    <ellipse cx="18" cy="58" rx="12" ry="20" fill="#3AAFCC" />
    <ellipse cx="82" cy="58" rx="12" ry="20" fill="#3AAFCC" />
    {/* Belly triangles */}
    <polygon points="40,55 45,65 35,65" fill="#3AAFCC" />
    <polygon points="50,55 55,65 45,65" fill="#3AAFCC" />
    <polygon points="60,55 65,65 55,65" fill="#3AAFCC" />
    <polygon points="45,65 50,75 40,75" fill="#3AAFCC" />
    <polygon points="55,65 60,75 50,75" fill="#3AAFCC" />
    {/* Head */}
    <circle cx="50" cy="35" r="30" fill="#5BC0DE" />
    {/* Ear tufts */}
    <polygon points="25,12 30,25 20,22" fill="#5BC0DE" />
    <polygon points="75,12 70,25 80,22" fill="#5BC0DE" />
    {/* Eye whites */}
    <circle cx="35" cy="35" r="16" fill="white" />
    <circle cx="65" cy="35" r="16" fill="white" />
    {/* Eye pupils */}
    <circle cx="38" cy="38" r="10" fill="#1a1a2e" />
    <circle cx="68" cy="38" r="10" fill="#1a1a2e" />
    {/* Eye shine */}
    <circle cx="34" cy="33" r="4" fill="white" />
    <circle cx="64" cy="33" r="4" fill="white" />
    {/* Beak - golden yellow */}
    <polygon points="50,45 46,52 54,52" fill="#FDD835" />
    {/* Feet */}
    <g fill="#FDD835">
      <ellipse cx="38" cy="92" rx="4" ry="3" />
      <ellipse cx="44" cy="92" rx="4" ry="3" />
      <ellipse cx="50" cy="92" rx="4" ry="3" />
      <ellipse cx="56" cy="92" rx="4" ry="3" />
      <ellipse cx="62" cy="92" rx="4" ry="3" />
    </g>
  </motion.svg>
);

export const MiniOwl = ({ className }: { className?: string }) => (
  <motion.div
    className={className}
    animate={{ y: [0, -5, 0], rotate: [0, 10, -10, 0] }}
    transition={{ duration: 3, repeat: Infinity }}
  >
    <OwlAvatar size={32} isAnimated={false} />
  </motion.div>
);
