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
            <Link to="/" className="flex items-center space-x-3" aria-label="LexAdvisor Home">
              <div className="p-2 bg-white rounded-xl shadow-lg">
                <Scale className="w-8 h-8 text-amber-700" />
              </div>
              <h1 className="text-3xl font-bold text-white">LexAdvisor</h1>
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
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 lg:p-10 hover:shadow-2xl transition">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">₹0</span>
                <span className="text-xl text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Perfect for getting started with legal research</p>
            </div>
            <ul className="space-y-4 mb-8 text-gray-700">
              {[
                '5 queries per day',
                'Basic legal guidance',
                'Access to BNS, DPDP, POCSO',
                'Chat history (7 days)',
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
          <div className="relative bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-2xl border border-amber-300 p-8 lg:p-10 hover:shadow-3xl hover:-translate-y-2 transition">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                <Star className="w-4 h-4" />
                <span>Most Popular</span>
              </div>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Premium</h3>
              <div className="mb-6 flex flex-col items-center space-y-2">
                <div className="text-4xl font-bold text-amber-700">₹499/year</div>
                <div className="text-gray-400">or</div>
                <div className="text-3xl font-bold text-gray-700">₹699/month</div>
                <p className="text-sm text-green-600 font-medium">Save 40% with annual billing</p>
              </div>
              <p className="text-gray-600">Complete legal research solution for professionals</p>
            </div>
            <ul className="space-y-4 mb-8 text-gray-700">
              {[
                'Unlimited queries',
                'Advanced legal analysis',
                'All Indian law domains',
                'Unlimited chat history',
                'Case law references',
                'Document analysis',
                'Priority support',
                'API access',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-amber-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="w-full block text-center px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-amber-800 transform hover:scale-105"
            >
              Start Premium Trial <ArrowRight className="ml-2 inline w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h3 className="text-4xl font-bold text-center text-gray-900">Frequently Asked Questions</h3>
          {[
            {
              q: 'Can I upgrade or downgrade my plan anytime?',
              a: 'Yes, you can upgrade to Premium anytime to unlock unlimited queries and advanced features. Changes take effect immediately, and billing is prorated accordingly.',
            },
            {
              q: 'Is there a free trial for the Premium plan?',
              a: 'Yes, we offer a 7-day free trial for the Premium plan. You can cancel anytime during the trial period without being charged.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely through encrypted channels.',
            },
          ].map(({ q, a }, idx) => (
            <div key={idx} className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-xl border border-amber-100">
              <h4 className="text-xl font-semibold mb-4">{q}</h4>
              <p className="text-gray-600">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 text-center text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Legal Research?</h3>
          <p className="text-xl mb-8">
            Join thousands of legal professionals who trust LexAdvisor for accurate, comprehensive legal guidance.
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
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
