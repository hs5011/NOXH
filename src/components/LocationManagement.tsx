import React, { useState } from 'react';
import { Trash2, Plus, Edit2, Save, X } from 'lucide-react';

interface Location {
  ward: string;
  oldArea: string;
}

interface LocationManagementProps {
  locations: Location[];
  setLocations: (locations: Location[]) => void;
}

export default function LocationManagement({ locations, setLocations }: LocationManagementProps) {
  const [newWard, setNewWard] = useState('');
  const [newOldArea, setNewOldArea] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editWard, setEditWard] = useState('');
  const [editOldArea, setEditOldArea] = useState('');

  const handleAdd = () => {
    if (newWard.trim() && newOldArea.trim()) {
      setLocations([...locations, { ward: newWard.trim(), oldArea: newOldArea.trim() }]);
      setNewWard('');
      setNewOldArea('');
    }
  };

  const handleDelete = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditWard(locations[index].ward);
    setEditOldArea(locations[index].oldArea);
  };

  const saveEdit = (index: number) => {
    const newLocations = [...locations];
    newLocations[index] = { ward: editWard, oldArea: editOldArea };
    setLocations(newLocations);
    setEditingIndex(null);
    setEditWard('');
    setEditOldArea('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Quản lý Địa điểm xây dựng</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" 
          value={newWard}
          onChange={(e) => setNewWard(e.target.value)}
          placeholder="Tên phường/xã" 
          className="px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
        />
        <input 
          type="text" 
          value={newOldArea}
          onChange={(e) => setNewOldArea(e.target.value)}
          placeholder="Tên khu vực cũ" 
          className="px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
        />
        <button 
          onClick={handleAdd}
          className="md:col-span-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Thêm địa điểm
        </button>
      </div>

      <div className="space-y-2">
        {locations.map((loc, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            {editingIndex === i ? (
              <div className="flex-1 grid grid-cols-2 gap-4 mr-4">
                <input 
                  type="text" 
                  value={editWard}
                  onChange={(e) => setEditWard(e.target.value)}
                  className="px-3 py-2 border border-blue-300 rounded-lg outline-none"
                />
                <input 
                  type="text" 
                  value={editOldArea}
                  onChange={(e) => setEditOldArea(e.target.value)}
                  className="px-3 py-2 border border-blue-300 rounded-lg outline-none"
                />
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-2 gap-4">
                <span className="font-medium text-slate-700">{loc.ward}</span>
                <span className="text-slate-500">{loc.oldArea}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {editingIndex === i ? (
                <>
                  <button onClick={() => saveEdit(i)} className="text-emerald-600 hover:text-emerald-700 p-2">
                    <Save size={18} />
                  </button>
                  <button onClick={() => setEditingIndex(null)} className="text-slate-500 hover:text-slate-600 p-2">
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(i)} className="text-blue-600 hover:text-blue-700 p-2">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(i)} className="text-rose-500 hover:text-rose-600 p-2">
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
