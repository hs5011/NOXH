import React, { useState } from 'react';
import { UserAccount } from '../types';
import { INITIAL_USERS } from '../data/appData';
import { Building2, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (user: UserAccount) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = INITIAL_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Building2 size={32} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Điều hành Dự án NOXH
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Đăng nhập để truy cập hệ thống
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Tên đăng nhập
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Mật khẩu
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-100">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Đăng nhập
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Tài khoản thử nghiệm
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <p className="font-medium text-slate-900">Admin</p>
                <p>User: admin</p>
                <p>Pass: 123456</p>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <p className="font-medium text-slate-900">Lãnh đạo SXD</p>
                <p>User: sxd</p>
                <p>Pass: 123456</p>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <p className="font-medium text-slate-900">Lãnh đạo STC</p>
                <p>User: stc</p>
                <p>Pass: 123456</p>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <p className="font-medium text-slate-900">Lãnh đạo CĐT</p>
                <p>User: cdt</p>
                <p>Pass: 123456</p>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-200 col-span-2">
                <p className="font-medium text-slate-900">Chuyên viên SXD</p>
                <p>User: sxd_cv</p>
                <p>Pass: 123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
