import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full justify-center text-center">
      <h1 className="text-3xl font-bold text-[#111111]">HSK KE Companion</h1>
      <button
        onClick={() => navigate('/home')}
        className="mt-6 w-full py-4 rounded-2xl text-white font-semibold text-base"
        style={{ background: '#F07820' }}
      >
        Login with Discord
      </button>
    </div>
  );
};

export default LoginPage;
