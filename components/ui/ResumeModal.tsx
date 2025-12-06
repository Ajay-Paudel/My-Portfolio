import React, { useState, useEffect } from 'react';
import { X, Download, Eye, FileText } from 'lucide-react';
import { RESUME_URL } from '../../constants';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-full h-[100dvh] z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-brand-indigo to-brand-violet text-white">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6" />
            <h3 className="font-bold text-lg">Resume - Ajay Paudel</h3>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={RESUME_URL}
              download="Ajay_Paudel_Resume.pdf"
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="h-[calc(90vh-72px)] bg-slate-100 dark:bg-slate-800">
          <iframe
            src={RESUME_URL}
            className="w-full h-full"
            title="Resume Preview"
          />
        </div>
      </div>
    </div>
  );
};

interface ResumeButtonProps {
  variant?: 'navbar' | 'mobile';
  className?: string;
}

export const ResumeButton: React.FC<ResumeButtonProps> = ({ variant = 'navbar', className = '' }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const baseStyles = variant === 'navbar' 
    ? "hidden sm:flex items-center px-4 py-2 font-medium text-sm text-brand-indigo border border-brand-indigo rounded-full hover:bg-brand-indigo hover:text-white transition-all duration-300"
    : "flex items-center justify-center w-full px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-brand-indigo hover:text-white hover:border-brand-indigo transition-all duration-300";

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          className={`${baseStyles} ${className}`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Resume
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-fade-in">
            <button
              onClick={() => {
                setShowModal(true);
                setShowDropdown(false);
              }}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-indigo/10 hover:text-brand-indigo dark:hover:text-brand-accent transition-colors"
            >
              <Eye className="w-4 h-4 mr-3" />
              Preview
            </button>
            <a
              href={RESUME_URL}
              download="Ajay_Paudel_Resume.pdf"
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-indigo/10 hover:text-brand-indigo dark:hover:text-brand-accent transition-colors border-t border-slate-100 dark:border-slate-700"
            >
              <Download className="w-4 h-4 mr-3" />
              Download
            </a>
          </div>
        )}
      </div>

      <ResumeModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
