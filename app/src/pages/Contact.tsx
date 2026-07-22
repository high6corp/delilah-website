import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Heart, Star } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { sendContactMessage } from '@/api/contact';

export default function Contact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await sendContactMessage(formData);
      setFormStatus('success');
    } catch {
      setFormStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    setFormStatus('idle');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <section
        className="py-16 md:py-20 px-6"
        style={{ background: 'linear-gradient(135deg, #F7F2FB 0%, #F0EBF7 100%)' }}
      >
        <div className="max-w-content mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-medium uppercase tracking-[0.08em] text-violet-500"
          >
            Send a Message
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-5xl md:text-6xl text-violet-900 mt-3"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-lg text-slate-600 max-w-lg"
          >
            Have something to say? Send a message to Miracle or Delilah. We&apos;d love to hear from you!
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-white py-section px-6">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Form */}
            <div className="md:col-span-3">
              <ScrollReveal>
                <div className="bg-white rounded-card shadow-md p-8 md:p-12">
                  {formStatus === 'error' ? (
                    <div className="text-center py-8">
                      <h2 className="font-display text-3xl text-red-600 mt-5">Oops!</h2>
                      <p className="mt-3 text-base text-slate-600">
                        Something went wrong sending your message. Please try again later.
                      </p>
                      <button
                        onClick={handleReset}
                        className="mt-6 px-6 py-3 border-[1.5px] border-violet-300 text-violet-500 text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-50 hover:border-violet-500 transition-all"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : formStatus === 'success' ? (
                    <div className="text-center py-8">
                      <Star size={32} className="text-violet-500 mx-auto animate-pulse-glow" />
                      <h2 className="font-display text-3xl text-violet-900 mt-5">Message Sent!</h2>
                      <p className="mt-3 text-base text-slate-600">
                        Thank you for reaching out. Miracle or Delilah will read your message soon.
                      </p>
                      <button
                        onClick={handleReset}
                        className="mt-6 px-6 py-3 border-[1.5px] border-violet-300 text-violet-500 text-xs font-medium uppercase tracking-[0.08em] rounded-pill hover:bg-violet-50 hover:border-violet-500 transition-all"
                      >
                        Send Another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name */}
                      <div>
                        <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                          Your Name <span className="text-violet-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Who are you?"
                          className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all"
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                          What&apos;s this about? <span className="text-violet-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="A quick note about..."
                          className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="text-xs font-medium uppercase tracking-[0.08em] text-violet-700 mb-2 block">
                          Your Message <span className="text-violet-400">*</span>
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          minLength={10}
                          placeholder="Write your message here..."
                          className="w-full px-4 py-3.5 rounded-input border-[1.5px] border-slate-300 text-sm placeholder:text-slate-400 outline-none focus:border-violet-500 focus:shadow-glow transition-all resize-vertical"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className={`
                          w-full sm:w-auto px-8 py-3.5 text-xs font-medium uppercase tracking-[0.08em] rounded-pill
                          transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2
                          ${formStatus === 'submitting'
                            ? 'bg-violet-400 text-white cursor-not-allowed'
                            : 'bg-violet-500 text-white hover:bg-violet-700 hover:shadow-glow'
                          }
                        `}
                      >
                        {formStatus === 'submitting' ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" />
                            Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            </div>

            {/* Info Card */}
            <div className="md:col-span-2">
              <ScrollReveal delay={0.15}>
                <div className="bg-violet-50 rounded-card p-8 md:sticky md:top-[100px]">
                  {/* For Miracle */}
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-violet-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-display text-xl text-violet-900">Mom Miracle</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        The wonderful mom who created this space for Delilah.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-violet-100 my-6" />

                  {/* For Delilah */}
                  <div className="flex items-start gap-3">
                    <Heart size={20} className="text-violet-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-display text-xl text-violet-900">Delilah</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        A special girl who brings joy to everyone around her.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-violet-100 my-6" />

                  {/* Family Note */}
                  <p className="font-accent text-base text-violet-500 italic leading-relaxed">
                    This is a private family space. If you&apos;re family and need the password, ask Miracle!
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}