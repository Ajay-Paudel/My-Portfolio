import React, { useState } from 'react';
import { Mail, MapPin, Send, AlertCircle, Sparkles, CheckCircle, X, Loader2 } from 'lucide-react';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', message: '' };

    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formState.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formState.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (formState.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setErrorMessage('');
      
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formState),
        });

        if (response.ok) {
          setShowSuccess(true);
          setFormState({ name: '', email: '', message: '' });
          setErrors({ name: '', email: '', message: '' });
          setTimeout(() => setShowSuccess(false), 5000);
        } else {
          // API failed, fall back to mailto
          openMailto();
        }
      } catch (error) {
        // API not available (local dev), fall back to mailto
        openMailto();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openMailto = () => {
    const mailtoLink = `mailto:ajayindrapaudel@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(formState.name)}&body=${encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
    )}`;
    window.location.href = mailtoLink;
    setShowSuccess(true);
    setFormState({ name: '', email: '', message: '' });
    setErrors({ name: '', email: '', message: '' });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const getInputClass = (error?: string) => `
    w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border 
    ${error 
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' 
      : 'border-slate-200 dark:border-slate-700 focus:border-brand-indigo dark:focus:border-brand-accent focus:ring-brand-indigo/20'
    } 
    focus:ring-2 transition-all outline-none dark:text-white dark:placeholder-slate-500
  `;

  return (
    <Section id="contact" className="bg-gradient-to-b from-white to-brand-light dark:from-slate-900 dark:to-slate-950">
      {/* Success Alert */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="flex items-center space-x-3 px-6 py-4 bg-green-500 text-white rounded-xl shadow-2xl">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-bold">Message Sent Successfully!</p>
              <p className="text-sm text-green-100">Your email client has been opened.</p>
            </div>
            <button 
              onClick={() => setShowSuccess(false)}
              className="ml-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-brand-indigo dark:text-brand-accent font-semibold tracking-wider uppercase text-sm mb-2">Get In Touch</h2>
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white">
            Let's Work <span className="text-gradient">Together</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-5 gap-10 bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
          {/* Contact Info Sidebar */}
          <div className="md:col-span-2 bg-slate-900 dark:bg-black p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-indigo rounded-full blur-[60px] opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-violet rounded-full blur-[60px] opacity-40"></div>
            
            <div className="relative z-10">
              <h4 className="font-heading font-bold text-2xl mb-6">Contact Info</h4>
              <p className="text-slate-300 mb-10 text-sm leading-relaxed">
                Fill up the form and I will get back to you within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-brand-indigo dark:text-brand-accent mt-1" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
                    <a href="mailto:ajayindrapaudel@gmail.com" className="hover:text-brand-indigo dark:hover:text-brand-accent transition-colors">ajayindrapaudel@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-brand-indigo dark:text-brand-accent mt-1" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Location</p>
                    <p>Kathmandu, Nepal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Hint */}
            <div className="relative z-10 pt-10">
               <div className="flex items-center space-x-2 text-xs text-brand-accent">
                 <Sparkles className="w-3 h-3" />
                 <span>Or ask my AI Assistant for help!</span>
               </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 p-10">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className={getInputClass(errors.name)}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 flex items-center mt-1 animate-fade-in-up">
                      <AlertCircle className="w-3 h-3 mr-1" /> {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className={getInputClass(errors.email)}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 flex items-center mt-1 animate-fade-in-up">
                      <AlertCircle className="w-3 h-3 mr-1" /> {errors.email}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  rows={4}
                  className={getInputClass(errors.message)}
                  placeholder="Tell me about your project..."
                ></textarea>
                {errors.message && (
                  <p className="text-xs text-red-500 flex items-center mt-1 animate-fade-in-up">
                    <AlertCircle className="w-3 h-3 mr-1" /> {errors.message}
                  </p>
                )}
              </div>

              <div className="pt-2 space-y-3">
                {errorMessage && (
                  <p className="text-sm text-red-500 flex items-center animate-fade-in-up">
                    <AlertCircle className="w-4 h-4 mr-2" /> {errorMessage}
                  </p>
                )}
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
};