"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const [isHovered, setIsHovered] = useState(false);

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/Viveknathtiwari01",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/vivek-nath-tiwari-a27156262/",
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      href: "https://x.com/TiwariViveknath",
    },
    {
      name: "Email",
      icon: <Mail className="h-5 w-5" />,
      href: "viveknath",
    },
  ];

  return (
    <footer className="w-full py-12 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <img src="/favicon.png" alt="Logo" className="h-8 w-8" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AI Career Coach
            </h2>
          </motion.div>

          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                {link.icon}
              </motion.a>
            ))}
          </div>

          {/* Made with Love */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center space-x-2 text-gray-400"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span>Made with</span>
            <motion.div
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
                rotate: isHovered ? [0, 10, -10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
            </motion.div>
            <span>by</span>
            <motion.span
              className="font-semibold text-blue-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Vivek Nath Tiwari
            </motion.span>
          </motion.div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-sm text-gray-500"
          >
            © {new Date().getFullYear()} AI Career Coach. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  );
} 