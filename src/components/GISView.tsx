import React from 'react';
import { MapPin, Search, Layers, Navigation } from 'lucide-react';

export default function GISView() {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Bản đồ GIS Dự án</h2>
          <p className="text-slate-500 text-sm">Theo dõi vị trí và trạng thái dự án trên bản đồ số</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm địa điểm, dự án..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
            <Layers size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-200 rounded-3xl relative overflow-hidden border border-slate-300 shadow-inner">
        {/* Real Map Embed */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d501726.46045115!2d106.36556474423627!3d10.754666384057485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5af6da25159b!2zVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1710565000000!5m2!1svi!2s" 
          className="absolute inset-0 w-full h-full border-0 grayscale-[0.2] contrast-[1.1]"
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        
        {/* Map Overlays (Styling) */}
        <div className="absolute inset-0 bg-blue-900/5 pointer-events-none" />
        
        {/* Legend */}
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Chú giải</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span>Đúng tiến độ</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <span>Sắp hết hạn</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-rose-500 rounded-full" />
              <span>Quá hạn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
