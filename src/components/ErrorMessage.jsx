import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-3xl glass-card border border-rose-500/30 p-8 text-center max-w-md mx-auto my-12 shadow-2xl">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Terjadi Gangguan</h3>
      <p className="text-sm text-slate-300 mb-6 leading-relaxed">
        {message || 'Gagal memuat data cuaca. Periksa koneksi internet atau coba kembali beberapa saat lagi.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition active:scale-95 shadow-lg shadow-sky-500/25 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Coba Lagi
        </button>
      )}
    </div>
  );
}
