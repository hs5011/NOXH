import React, { useState } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('specialist');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username) {
      login(username, role);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full p-2 border rounded">
          <option value="admin">Admin</option>
          <option value="leader">Lãnh đạo</option>
          <option value="specialist">Chuyên viên</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-bold">Đăng nhập</button>
      </form>
    </div>
  );
}
