import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 dark:border-gray-900 mt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">W</span>
              </div>
              <h3 className="text-sm font-bold tracking-tight">Weather Intelligence</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              A professional-grade weather monitoring tool providing real-time data and historical record management for professionals worldwide.
            </p>
            <p className="text-xs font-semibold text-gray-400">
              Developed by <span className="text-blue-600 dark:text-blue-400">Om Joshi</span>
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">About PM Accelerator</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              The Product Manager Accelerator Program is designed to support PM professionals through every stage of their careers. 
              From students looking for entry-level jobs to Directors looking to take on a leadership role, 
              our program has helped over hundreds of students fulfill their career aspirations.
            </p>
            <a 
              href="https://www.linkedin.com/school/pmaccelerator/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
            >
              Learn More on LinkedIn →
            </a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-medium text-gray-300 dark:text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} Weather Intelligence. All rights reserved.
          </p>
          <p className="text-[10px] font-black text-gray-200 dark:text-gray-800 uppercase tracking-[0.2em]">
            Version 2.0.0 Stable
          </p>
        </div>
      </div>
    </footer>
  );
}
