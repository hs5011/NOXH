import React, { useState } from 'react';
import { Trash2, Plus, Edit2, Save, X } from 'lucide-react';

interface ListManagementProps {
  items: string[];
  setItems: (items: string[]) => void;
  title: string;
}

export default function ListManagement({ items, setItems, title }: ListManagementProps) {
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleDelete = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  const saveEdit = (index: number) => {
    const newItems = [...items];
    newItems[index] = editValue;
    setItems(newItems);
    setEditingIndex(null);
    setEditValue('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Quản lý {title}</h2>
      
      <div className="flex gap-2">
        <input 
          type="text" 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={`Thêm ${title.toLowerCase()} mới...`} 
          className="flex-1 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
        />
        <button 
          onClick={handleAdd}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Thêm
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            {editingIndex === i ? (
              <input 
                type="text" 
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg outline-none mr-4"
              />
            ) : (
              <span className="font-medium text-slate-700">{item}</span>
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
