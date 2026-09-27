import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#111111]">Profile</h1>
      <button
        onClick={() => navigate('/login')}
        className="w-full py-4 rounded-2xl font-semibold text-sm border-2 flex items-center justify-center gap-2 active:opacity-80"
        style={{ color: '#E03030', borderColor: '#E03030' }}
      >
        Logout from Discord
      </button>
    </div>
  );
};

export default ProfilePage;
