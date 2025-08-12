import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Check, ArrowRight, Star } from 'lucide-react';

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center space-x-3" aria-label="Lex & Tech AI Home">
              <div className="p-2 bg-white rounded-xl shadow-lg">
                <Scale className="w-8 h-8 text-amber-700" />
              </div>
              <h1 className="text-3xl font-bold text-white">Lex & Tech AI</h1>
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-amber-700 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-gray-900 transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-600">Legal Plan</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Get access to India's most comprehensive AI legal assistant. Choose the plan that fits your needs.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 lg:p-10 hover:shadow-2xl transition flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">₹0</span>
                <span className="text-xl text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Perfect for getting started with legal research</p>
            </div>
            <ul className="space-y-4 mb-8 text-gray-700 flex-grow">
              {[
                '4 queries per user',
                'Chat history',
                'Email support',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="w-full block text-center px-6 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition transform hover:scale-105"
            >
              Get Started Free <ArrowRight className="ml-2 inline w-5 h-5" />
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="relative bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-2xl border border-amber-300 p-8 lg:p-10 hover:shadow-2xl transition hover:-translate-y-2 flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-600 mb-6">Get a customized solution for your legal needs</p>
            </div>
            <ul className="space-y-4 mb-8 text-gray-700 flex-grow">
              {[
                'Unlimited queries',
                'Priority support',
                'Chat history',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-amber-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="w-full block text-center px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-amber-800 transition"
            >
              Contact Us <ArrowRight className="ml-2 inline w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 text-center text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Legal Research?</h3>
          <p className="text-xl mb-8">
            Join thousands of legal professionals who trust Lex & Tech AI for accurate, comprehensive legal guidance.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-amber-700 font-semibold text-lg rounded-xl shadow-xl hover:bg-gray-50 transform hover:scale-105"
          >
            Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto text-center px-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Lex & Tech AI</span>
          </div>
          <p className="text-gray-400 mb-2">Empowering legal clarity through AI-powered assistance</p>
          <p className="text-gray-500 text-sm">© 2025 Lex & Tech AI. All rights reserved.</p>
          <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm mt-2 block">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
