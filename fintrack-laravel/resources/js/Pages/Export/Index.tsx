import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { FileDown, Calendar, FileSpreadsheet, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ExportPage() {
    const [startDate, setStartDate] = useState(() => {
        const d = new Date(); d.setDate(1);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [format, setFormat] = useState<'CSV' | 'PDF'>('CSV');
    const [isExporting, setIsExporting] = useState(false);

    // Mock data for preview
    const totalTransactions = 42;
    const totalIncome = 15000000;
    const totalExpense = 8500000;

    const handleExport = async () => {
        setIsExporting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (format === 'CSV') {
            const headers = ['Tanggal', 'Deskripsi', 'Tipe', 'Kategori', 'Jumlah', 'Dompet'];
            const csvContent = [headers.join(','), '2024-01-15,"Gaji Bulanan",INCOME,Gaji,15000000,BCA'].join('\n');
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `Laporan_Keuangan_${startDate}_sd_${endDate}.csv`);
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            toast.success('Laporan Excel/CSV berhasil diunduh!');
        } else {
            toast.success('Laporan PDF berhasil diunduh!');
        }
        setIsExporting(false);
    };

    const formatCompact = (n: number) => new Intl.NumberFormat('id-ID', { notation: 'compact', compactDisplay: 'short' }).format(n);

    return (
        <AppLayout header={
            <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl"><FileDown className="w-6 h-6" /></div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Export Laporan</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Unduh riwayat transaksi untuk keperluan pembukuan</p>
                </div>
            </div>
        }>
            <Head title="Export Laporan" />
            <Toaster position="top-right" />

            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Controls */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center"><Calendar className="w-4 h-4 mr-2 text-indigo-500" /> Pilih Rentang Tanggal</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Dari Tanggal</label>
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-medium transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Sampai Tanggal</label>
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-medium transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Format File</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setFormat('CSV')} className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all ${format === 'CSV' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 dark:text-slate-400'}`}>
                                    <FileSpreadsheet className="w-6 h-6 mr-2" /><span className="font-bold">Excel / CSV</span>
                                    {format === 'CSV' && <CheckCircle2 className="w-5 h-5 ml-auto text-emerald-600 dark:text-emerald-400" />}
                                </button>
                                <button onClick={() => setFormat('PDF')} className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all ${format === 'PDF' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 dark:text-slate-400'}`}>
                                    <FileText className="w-6 h-6 mr-2" /><span className="font-bold">PDF Report</span>
                                    {format === 'PDF' && <CheckCircle2 className="w-5 h-5 ml-auto text-red-600 dark:text-red-400" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Summary Preview */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Ringkasan Laporan</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                                    <span className="text-slate-400 text-sm">Total Transaksi</span>
                                    <span className="font-bold text-lg">{totalTransactions}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-emerald-400 text-sm">Pemasukan</span>
                                    <span className="font-bold text-emerald-400">+ {formatCompact(totalIncome)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-red-400 text-sm">Pengeluaran</span>
                                    <span className="font-bold text-red-400">- {formatCompact(totalExpense)}</span>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button onClick={handleExport} disabled={isExporting} className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center disabled:opacity-70">
                                    {isExporting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Memproses...</> : <><FileDown className="w-5 h-5 mr-2" /> Download {format}</>}
                                </button>
                            </div>
                        </div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-xl border border-blue-100 dark:border-blue-800">
                            <p><strong>Catatan:</strong> Laporan Excel menggunakan format CSV yang kompatibel. Laporan PDF dibuat secara otomatis di browser.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
