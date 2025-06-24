
import React from 'react';
import { Mail, Phone } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-300">
            Visit our store or contact us for personalized styling consultation
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="w-6 h-6 text-indigo-400 mr-3" />
                <span className="text-lg">+91 9876543210</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-6 h-6 text-indigo-400 mr-3" />
                <span className="text-lg">info@samiyaweddingcenter.com</span>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Store Location</h4>
                <p className="text-gray-300">123 Wedding Street, Fashion District</p>
                <p className="text-gray-300">Mumbai, Maharashtra 400001</p>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Store Hours</h4>
                <p className="text-gray-300">Monday - Sunday: 10:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>
              <div>
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
