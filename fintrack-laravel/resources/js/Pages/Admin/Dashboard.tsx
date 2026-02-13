import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    LayoutDashboard, Users, Activity, Database, FileText,
    Shield, UserCheck, UserX, AlertTriangle, Eye, Edit2, Trash2, Key, Ban,
    Search, Flag, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, X, Check
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

type AdminTab = 'OVERVIEW' | 'USERS' | 'TRANSACTIONS' | 'MASTER' | 'LOGS';

// ============ MOCK DATA ============
const MOCK_USERS = [
    { id: '1', name: 'Budi Santoso', email: 'budi@email.com', role: 'USER', status: 'ACTIVE', transactions: 124, totalBalance: 15000000, joinDate: '2024-01-15' },
    { id: '2', name: 'Siti Aminah', email: 'siti@email.com', role: 'USER', status: 'ACTIVE', transactions: 89, totalBalance: 8500000, joinDate: '2024-02-20' },
    { id: '3', name: 'Admin System', email: 'admin@fintrack.ai', role: 'ADMIN', status: 'ACTIVE', transactions: 12, totalBalance: 50000000, joinDate: '2024-01-01' },
    { id: '4', name: 'Dewi Larasati', email: 'dewi@email.com', role: 'USER', status: 'SUSPENDED', transactions: 45, totalBalance: 3200000, joinDate: '2024-03-10' },
];

const MOCK_TRANSACTIONS_LIVE = [
    { id: 't1', userId: '1', userName: 'Budi Santoso', description: 'Gaji Bulanan Oktober', type: 'INCOME', amount: 15000000, date: '2024-10-25', flagged: false },
    { id: 't2', userId: '2', userName: 'Siti Aminah', description: 'Belanja Bulanan', type: 'EXPENSE', amount: 2500000, date: '2024-10-24', flagged: false },
    { id: 't3', userId: '1', userName: 'Budi Santoso', description: 'Transfer Mencurigakan', type: 'EXPENSE', amount: 50000000, date: '2024-10-24', flagged: true },
    { id: 't4', userId: '4', userName: 'Dewi Larasati', description: 'Pembayaran Listrik', type: 'EXPENSE', amount: 450000, date: '2024-10-23', flagged: false },
    { id: 't5', userId: '2', userName: 'Siti Aminah', description: 'Freelance Project', type: 'INCOME', amount: 8000000, date: '2024-10-22', flagged: false },
];

const MOCK_LOGS = [
    { id: 'l1', timestamp: '2024-10-25 14:30:22', actor: 'Admin System', action: 'UPDATE_USER', target: 'Budi Santoso', details: 'Role diubah ke ADMIN' },
    { id: 'l2', timestamp: '2024-10-25 12:15:00', actor: 'System', action: 'CREATE_BACKUP', target: 'Database', details: 'Backup otomatis harian' },
    { id: 'l3', timestamp: '2024-10-24 18:45:33', actor: 'Admin System', action: 'DELETE_TRANSACTION', target: 'TXN-#4521', details: 'Transaksi duplikat dihapus' },
    { id: 'l4', timestamp: '2024-10-24 09:00:00', actor: 'System', action: 'LOGIN', target: 'Budi Santoso', details: 'Login berhasil dari 192.168.1.1' },
];

const MOCK_CATEGORIES = ['Makanan', 'Transportasi', 'Hiburan', 'Belanja', 'Kesehatan', 'Pendidikan'];
const MOCK_BANKS = ['BCA', 'BNI', 'BRI', 'Mandiri', 'GoPay', 'OVO', 'Dana'];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
    const pageProps = usePage().props as any;

    // Stats from props — controller passes stats + flaggedTransactions separately
    const serverStats = pageProps.stats || {};
    const flaggedList = pageProps.flaggedTransactions || [];
    const stats = {
        totalUsers: serverStats.totalUsers ?? 4,
        activeUsers: serverStats.activeUsers ?? 3,
        totalTransactions: serverStats.totalTransactions ?? 270,
        flaggedTransactions: flaggedList.length ?? 0,
    };

    const TabButton = ({ id, label, icon: Icon }: { id: AdminTab; label: string; icon: any }) => (
        <button onClick={() => setActiveTab(id)} className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 translate-y-[-1px]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
            <Icon className="w-4 h-4 mr-2" /> {label}
        </button>
    );

    return (
        <AppLayout header={
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl"><Shield className="w-6 h-6" /></div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Admin Panel</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Kelola pengguna, transaksi, dan sistem</p>
                </div>
            </div>
        }>
            <Head title="Admin Panel" />
            <Toaster position="top-right" />

            <div className="space-y-6 animate-fade-in-up">
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    <TabButton id="OVERVIEW" label="Overview" icon={LayoutDashboard} />
                    <TabButton id="USERS" label="Users" icon={Users} />
                    <TabButton id="TRANSACTIONS" label="Transaksi" icon={Activity} />
                    <TabButton id="MASTER" label="Master Data" icon={Database} />
                    <TabButton id="LOGS" label="Logs" icon={FileText} />
                </div>

                {/* Tab Content */}
                {activeTab === 'OVERVIEW' && <OverviewTab stats={stats} />}
                {activeTab === 'USERS' && <UsersTab />}
                {activeTab === 'TRANSACTIONS' && <TransactionsTab />}
                {activeTab === 'MASTER' && <MasterDataTab />}
                {activeTab === 'LOGS' && <LogsTab />}
            </div>
        </AppLayout>
    );
}

// ============ OVERVIEW TAB ============
function OverviewTab({ stats }: { stats: any }) {
    const statCards = [
        { label: 'Total Pengguna', value: stats.totalUsers, icon: Users, color: 'from-blue-600 to-indigo-600', shadowColor: 'shadow-blue-500/20' },
        { label: 'Pengguna Aktif', value: stats.activeUsers, icon: UserCheck, color: 'from-emerald-600 to-green-600', shadowColor: 'shadow-emerald-500/20' },
        { label: 'Total Transaksi', value: stats.totalTransactions, icon: Activity, color: 'from-violet-600 to-purple-600', shadowColor: 'shadow-violet-500/20' },
        { label: 'Flagged', value: stats.flaggedTransactions, icon: AlertTriangle, color: 'from-red-600 to-rose-600', shadowColor: 'shadow-red-500/20' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <div key={i} className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${card.color} text-white shadow-xl ${card.shadowColor} animate-fade-in-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
                        <card.icon className="w-8 h-8 opacity-80 mb-3" />
                        <p className="text-3xl font-bold">{card.value.toLocaleString('id-ID')}</p>
                        <p className="text-sm text-white/70 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Quick Chart Placeholder */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-indigo-500" /> Aktivitas Sistem (7 Hari Terakhir)</h3>
                    <div className="grid grid-cols-7 gap-2 h-32 items-end">
                        {[65, 80, 45, 90, 72, 55, 85].map((val, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div className="w-full bg-indigo-500/20 rounded-lg relative overflow-hidden" style={{ height: `${val}%` }}>
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-lg transition-all duration-500 hover:from-indigo-700" style={{ height: '100%' }} />
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Logs */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center"><FileText className="w-4 h-4 mr-2 text-indigo-500" /> Log Terbaru</h3>
                    <div className="space-y-3">
                        {MOCK_LOGS.slice(0, 3).map(log => (
                            <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <div className={`p-1.5 rounded-lg mt-0.5 ${log.action.includes('DELETE') ? 'bg-red-100 text-red-600' : log.action.includes('UPDATE') ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    <Activity className="w-3 h-3" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{log.details}</p>
                                    <p className="text-[10px] text-slate-400">{log.actor} • {log.timestamp.split(' ')[1]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============ USERS TAB ============
function UsersTab() {
    const [users, setUsers] = useState(MOCK_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingUser, setEditingUser] = useState<typeof MOCK_USERS[0] | null>(null);
    const [viewingUser, setViewingUser] = useState<typeof MOCK_USERS[0] | null>(null);
    const [deletingUser, setDeletingUser] = useState<typeof MOCK_USERS[0] | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleEdit = (user: typeof MOCK_USERS[0]) => { setEditingUser(user); setEditForm({ name: user.name, email: user.email, role: user.role }); };
    const handleSaveEdit = () => { if (!editingUser) return; setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...editForm } : u)); setEditingUser(null); toast.success('Data user berhasil diperbarui'); };
    const handleToggleStatus = (id: string) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u)); toast.success('Status user diperbarui'); };
    const handleResetPassword = (user: typeof MOCK_USERS[0]) => { toast.success(`Password ${user.name} berhasil direset`); };
    const handleDelete = () => { if (!deletingUser) return; setUsers(prev => prev.filter(u => u.id !== deletingUser.id)); setDeletingUser(null); toast.success('User berhasil dihapus'); };

    return (
        <div className="space-y-4">
            {/* Search bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari user (nama atau email)..." className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white transition-colors" />
            </div>

            {/* Stats row */}
            <div className="flex gap-4 mb-2">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl"><span className="text-xs text-slate-500">Total:</span> <span className="font-bold text-indigo-600 dark:text-indigo-400">{users.length}</span></div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl"><span className="text-xs text-slate-500">Aktif:</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">{users.filter(u => u.status === 'ACTIVE').length}</span></div>
                <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl"><span className="text-xs text-slate-500">Suspended:</span> <span className="font-bold text-red-600 dark:text-red-400">{users.filter(u => u.status === 'SUSPENDED').length}</span></div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                            <tr><th className="px-6 py-4 text-left">User</th><th className="px-6 py-4 text-left">Role</th><th className="px-6 py-4 text-left">Status</th><th className="px-6 py-4 text-right">Transaksi</th><th className="px-6 py-4 text-center">Aksi</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">{user.name.charAt(0)}</div>
                                            <div><p className="font-bold text-slate-800 dark:text-white">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>{user.role}</span></td>
                                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{user.status === 'ACTIVE' ? 'Aktif' : 'Suspended'}</span></td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-white">{user.transactions}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => setViewingUser(user)} title="Detail" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                                            <button onClick={() => handleEdit(user)} title="Edit" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleResetPassword(user)} title="Reset Password" className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"><Key className="w-4 h-4" /></button>
                                            <button onClick={() => handleToggleStatus(user.id)} title={user.status === 'ACTIVE' ? 'Suspend' : 'Activate'} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors"><Ban className="w-4 h-4" /></button>
                                            <button onClick={() => setDeletingUser(user)} title="Hapus" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setEditingUser(null)}>
                    <div className="glass-card w-full max-w-md rounded-2xl p-6 animate-pop-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-slate-800 dark:text-white">Edit User</h3><button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X className="w-5 h-5" /></button></div>
                        <div className="space-y-4">
                            <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nama</label><input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white" /></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Email</label><input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white" /></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Role</label><select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"><option value="USER">User</option><option value="ADMIN">Admin</option></select></div>
                        </div>
                        <div className="flex gap-3 mt-6"><button onClick={() => setEditingUser(null)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Batal</button><button onClick={handleSaveEdit} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">Simpan</button></div>
                    </div>
                </div>
            )}

            {/* View Detail Modal */}
            {viewingUser && (
                <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewingUser(null)}>
                    <div className="glass-card w-full max-w-md rounded-2xl p-6 animate-pop-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-slate-800 dark:text-white">Detail User</h3><button onClick={() => setViewingUser(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X className="w-5 h-5" /></button></div>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">{viewingUser.name.charAt(0)}</div>
                            <p className="font-bold text-lg text-slate-800 dark:text-white">{viewingUser.name}</p>
                            <p className="text-sm text-slate-500">{viewingUser.email}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center"><p className="text-xs text-slate-400 mb-1">Transaksi</p><p className="text-xl font-bold text-slate-800 dark:text-white">{viewingUser.transactions}</p></div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center"><p className="text-xs text-slate-400 mb-1">Total Saldo</p><p className="text-xl font-bold text-emerald-600">Rp {(viewingUser.totalBalance / 1000000).toFixed(1)}jt</p></div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center"><p className="text-xs text-slate-400 mb-1">Join Date</p><p className="text-sm font-bold text-slate-800 dark:text-white">{viewingUser.joinDate}</p></div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center"><p className="text-xs text-slate-400 mb-1">Status</p><span className={`text-sm font-bold ${viewingUser.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-600'}`}>{viewingUser.status}</span></div>
                        </div>
                        <button onClick={() => setViewingUser(null)} className="w-full mt-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Tutup</button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deletingUser && (
                <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setDeletingUser(null)}>
                    <div className="glass-card w-full max-w-sm rounded-2xl p-6 animate-pop-in" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-600" /></div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Hapus User?</h3>
                            <p className="text-sm text-slate-500">User <strong>{deletingUser.name}</strong> dan semua datanya akan dihapus permanen.</p>
                        </div>
                        <div className="flex gap-3"><button onClick={() => setDeletingUser(null)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200">Batal</button><button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">Hapus</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============ TRANSACTIONS TAB ============
function TransactionsTab() {
    const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS_LIVE);
    const [filter, setFilter] = useState<'ALL' | 'HIGH_VALUE' | 'FLAGGED'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTransactions = useMemo(() => {
        let result = transactions;
        if (filter === 'HIGH_VALUE') result = result.filter(t => t.amount >= 10000000);
        if (filter === 'FLAGGED') result = result.filter(t => t.flagged);
        if (searchQuery) result = result.filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.userName.toLowerCase().includes(searchQuery.toLowerCase()));
        return result;
    }, [transactions, filter, searchQuery]);

    const toggleFlag = (id: string) => {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, flagged: !t.flagged } : t));
        toast.success('Status flag diperbarui');
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari transaksi atau user..." className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white transition-colors" />
                </div>
                <div className="flex gap-2">
                    {([['ALL', 'Semua'], ['HIGH_VALUE', 'High Value'], ['FLAGGED', 'Flagged']] as const).map(([id, label]) => (
                        <button key={id} onClick={() => setFilter(id)} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${filter === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:text-indigo-600'}`}>{label}</button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                            <tr><th className="px-6 py-4 text-left">User</th><th className="px-6 py-4 text-left">Deskripsi</th><th className="px-6 py-4 text-left">Tipe</th><th className="px-6 py-4 text-right">Jumlah</th><th className="px-6 py-4 text-center">Audit</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredTransactions.map(tx => (
                                <tr key={tx.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${tx.flagged ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{tx.userName.charAt(0)}</div>
                                            <span className="font-medium text-slate-800 dark:text-white">{tx.userName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{tx.description}</td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1 text-xs font-bold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {tx.type === 'INCOME' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                            {tx.type === 'INCOME' ? 'Masuk' : 'Keluar'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-white">Rp {tx.amount.toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => toggleFlag(tx.id)} className={`p-2 rounded-lg transition-colors ${tx.flagged ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'text-slate-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30'}`} title={tx.flagged ? 'Unflag' : 'Flag'}>
                                            <Flag className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-10 text-slate-400"><Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />Tidak ada transaksi ditemukan</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ============ MASTER DATA TAB ============
function MasterDataTab() {
    const [categories, setCategories] = useState(MOCK_CATEGORIES);
    const [banks, setBanks] = useState(MOCK_BANKS);
    const [newCategory, setNewCategory] = useState('');
    const [newBank, setNewBank] = useState('');
    const [deletingItem, setDeletingItem] = useState<{ type: 'category' | 'bank'; name: string } | null>(null);

    const handleAddCategory = () => {
        if (!newCategory.trim()) return;
        setCategories(prev => [...prev, newCategory.trim()]);
        setNewCategory('');
        toast.success('Kategori ditambahkan');
    };

    const handleAddBank = () => {
        if (!newBank.trim()) return;
        setBanks(prev => [...prev, newBank.trim()]);
        setNewBank('');
        toast.success('Bank/E-Wallet ditambahkan');
    };

    const handleDeleteConfirmed = () => {
        if (!deletingItem) return;
        if (deletingItem.type === 'category') setCategories(prev => prev.filter(c => c !== deletingItem.name));
        else setBanks(prev => prev.filter(b => b !== deletingItem.name));
        toast.success(`${deletingItem.name} berhasil dihapus`);
        setDeletingItem(null);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Default Categories */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white">Kategori Default</h3>
                    <p className="text-xs text-slate-500 mt-1">Kelola kategori default untuk user baru</p>
                </div>
                <div className="p-5">
                    <div className="flex gap-2 mb-4">
                        <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddCategory()} placeholder="Nama kategori baru..." className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white" />
                        <button onClick={handleAddCategory} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                        {categories.map((cat, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{cat}</span>
                                <button onClick={() => setDeletingItem({ type: 'category', name: cat })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Banks / E-Wallets */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white">Bank & E-Wallet</h3>
                    <p className="text-xs text-slate-500 mt-1">Daftar bank dan e-wallet tersedia</p>
                </div>
                <div className="p-5">
                    <div className="flex gap-2 mb-4">
                        <input type="text" value={newBank} onChange={e => setNewBank(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddBank()} placeholder="Nama bank/e-wallet..." className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white" />
                        <button onClick={handleAddBank} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                        {banks.map((bank, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{bank}</span>
                                <button onClick={() => setDeletingItem({ type: 'bank', name: bank })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation */}
            {deletingItem && (
                <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setDeletingItem(null)}>
                    <div className="glass-card w-full max-w-sm rounded-2xl p-6 animate-pop-in" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-7 h-7 text-red-600" /></div>
                            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Hapus "{deletingItem.name}"?</h3>
                            <p className="text-sm text-slate-500">Item ini akan dihapus dari daftar.</p>
                        </div>
                        <div className="flex gap-3"><button onClick={() => setDeletingItem(null)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200">Batal</button><button onClick={handleDeleteConfirmed} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">Hapus</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============ LOGS TAB ============
function LogsTab() {
    const getActionColor = (action: string) => {
        if (action.includes('DELETE')) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30';
        if (action.includes('UPDATE')) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30';
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30';
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                        <tr><th className="px-6 py-4 text-left">Waktu</th><th className="px-6 py-4 text-left">Aktor</th><th className="px-6 py-4 text-left">Aksi</th><th className="px-6 py-4 text-left">Target</th><th className="px-6 py-4 text-left">Detail</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {MOCK_LOGS.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{log.actor}</td>
                                <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getActionColor(log.action)}`}>{log.action}</span></td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{log.target}</td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
