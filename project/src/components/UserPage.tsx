import React, { useState, useEffect } from 'react';
import { Link,useLocation  } from 'react-router-dom';
import { Scale, User, Settings, LogOut, X, Save } from 'lucide-react';
import { ApiClient } from '../utils/api';

const UserPage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const location = useLocation();
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subscriptions: '',
    number_of_requests: 0,
    created_at: '',
    organization: ''
  });
  const [editData, setEditData] = useState(profileData);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await ApiClient.getCurrentUser();
        setProfileData(userData);
        setEditData(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleEditClick = () => {
    setEditData(profileData);
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        console.error("User ID not found.");
        return;
      }
      await ApiClient.updateUserProfile(userId, {
        full_name: editData.full_name,
        phone: editData.phone,
        organization: editData.organization,
      });
      setProfileData(editData);
      setIsEditModalOpen(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile.");
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-gray-50 relative">
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 text-white">
                <User className="w-6 h-6" />
                <span className="font-semibold">{profileData.full_name}</span>
              </div>
              <button className="px-4 py-2 bg-white text-amber-700 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-600">{profileData.full_name}</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Your AI legal assistant is ready to help. Continue your legal research journey.
          </p>
        </div>
      </section>

      {/* Dashboard Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Account Settings */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition flex flex-col">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h3>
              <p className="text-gray-600">Manage your profile and preferences</p>
            </div>
            <div className="space-y-3 mb-6 flex-grow">
              <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Name</span>
                <span className="text-sm text-gray-600">{profileData.full_name}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="text-sm text-gray-600">{profileData.email}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <span className="text-sm text-gray-600">{profileData.phone}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Organization</span>
                <span className="text-sm text-gray-600">{profileData.organization}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Plan</span>
                <span className="text-sm text-amber-700 font-semibold">{profileData.subscriptions}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Number of Requests</span>
                <span className="text-sm text-amber-700 font-semibold">{profileData.number_of_requests}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Member since</span>
                <span className="text-sm text-gray-600">{profileData.created_at}</span>
              </div>
            </div>
            <button 
              onClick={handleEditClick}
              className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 text-center text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold mb-6">Ready to Continue Your Legal Research?</h3>
          <p className="text-xl mb-8">
            Ask your legal questions and get comprehensive, AI-powered answers instantly.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-white text-amber-700 font-semibold text-lg rounded-xl shadow-xl hover:bg-gray-50 transform hover:scale-105">
            Start New Query
          </button>
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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editData.full_name}
                  onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  placeholder="Enter your email"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  value={editData.organization}
                  onChange={(e) => setEditData({...editData, organization: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  placeholder="Enter your organization"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;