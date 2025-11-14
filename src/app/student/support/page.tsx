'use client';

import { useState } from 'react';
import StudentLayout from '@/components/layouts/StudentLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Notification, useNotification } from '@/components/ui/Notification';
import { Mail, Phone, MessageSquare, Send } from 'lucide-react';

export default function StudentSupportPage() {
  const [form, setForm] = useState({
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notification, showNotification, clearNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      showNotification('success', 'Your message has been sent! We\'ll get back to you soon.');
      setForm({ subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-wide mb-2">
            CONTACT SUPPORT
          </h1>
          <p className="text-sm text-gray-600">
            Need help? We're here for you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</p>
                <p className="text-sm font-bold">support@campusnest.com</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</p>
                <p className="text-sm font-bold">+234 800 123 4567</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Hours</p>
                <p className="text-sm font-bold">Mon - Fri, 9AM - 5PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold uppercase tracking-wide mb-4">
            SEND US A MESSAGE
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="What's this about?"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell us more about your issue or question..."
                required
                rows={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all resize-none text-sm"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full md:w-auto rounded-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>SENDING...</>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  SEND MESSAGE
                </>
              )}
            </Button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold uppercase tracking-wide mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold mb-1">How do I make a booking?</h3>
              <p className="text-sm text-gray-600">
                Browse available lodges, select your preferred accommodation, and complete the payment process to secure your booking.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-1">Can I cancel or modify my booking?</h3>
              <p className="text-sm text-gray-600">
                Yes, you can request modifications or cancellations through your bookings page. Refund policies vary depending on the timing of your request.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-1">How does the inspection process work?</h3>
              <p className="text-sm text-gray-600">
                After booking, you can request an inspection. Once approved by the landlord, you can visit the property. After inspection, you can either approve or request a refund.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-1">When will I get my refund?</h3>
              <p className="text-sm text-gray-600">
                Refunds are processed within 5-7 business days after approval. The amount will be returned to your original payment method.
              </p>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
        />
      )}
    </StudentLayout>
  );
}
