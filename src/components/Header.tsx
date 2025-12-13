
import React, { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
    toggleSidebar: () => void;
}

const SEARCH_ITEMS = [
    { title: 'Beranda', path: '/', category: 'Page' },
    { title: 'Ukur', path: '/measure', category: 'Page' },
    { title: 'Pembelajaran', path: '/learning', category: 'Page' },
    { title: 'Challenge', path: '/challenge', category: 'Page' },
    { title: 'Riwayat', path: '/history', category: 'Page' },
    { title: 'Pengaturan', path: '/settings', category: 'Page' },
    { title: 'Bilangan Real (ℝ)', path: '/learning', category: 'Topic' },
    { title: 'Interval', path: '/learning', category: 'Topic' },
    { title: 'Supremum & Infimum', path: '/learning', category: 'Topic' },
    { title: 'Epsilon (ε)', path: '/learning', category: 'Topic' },
    { title: 'Sifat Field', path: '/learning', category: 'Topic' },
    { title: 'Sifat Urutan', path: '/learning', category: 'Topic' },
];

const Header = ({ toggleSidebar }: HeaderProps) => {
    const { language, setLanguage } = useLanguage();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<typeof SEARCH_ITEMS>([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (query.trim()) {
            const filtered = SEARCH_ITEMS.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
            setShowResults(true);
        } else {
            setResults([]);
            setShowResults(false);
        }
    }, [query]);

    const handleSelect = (path: string) => {
        navigate(path);
        setQuery('');
        setShowResults(false);
    };

    return (
        <header className="sticky top-0 z-30 bg-dashboard-bg/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 border-b border-white/5">
            {/* Mobile & Logo Area */}
            <div className="flex items-center gap-4 shrink-0">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 hover:bg-white/10 rounded-lg text-dashboard-accent transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Mobile Logo View (if sidebar hidden) */}
                <span className="md:hidden font-bold text-lg text-dashboard-accent">Real Measure</span>
            </div>

            {/* Search Container & Language Toggle */}
            <div className="flex-1 max-w-5xl relative flex items-center gap-4">

                {/* Search Bar - Wider */}
                <div className="relative hidden sm:block w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query && setShowResults(true)}
                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-dashboard-accent rounded-full h-11 shadow-sm w-full transition-all focus:bg-white/10"
                    />
                    {/* Search Dropdown */}
                    {showResults && (
                        <div className="absolute top-14 left-0 right-0 bg-dashboard-card rounded-xl shadow-xl border border-white/10 overflow-hidden max-h-80 overflow-y-auto z-50">
                            {results.length > 0 ? (
                                <div className="py-2">
                                    {results.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelect(item.path)}
                                            className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between group transition-colors"
                                        >
                                            <span className="font-medium text-slate-300 group-hover:text-dashboard-accent">{item.title}</span>
                                            <span className="text-xs text-slate-500 uppercase tracking-wider">{item.category}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-slate-500 text-sm">No results found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Language Toggle (ID/EN) */}
                <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10 shrink-0">
                    <button
                        onClick={() => setLanguage('id')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${language === 'id'
                                ? 'bg-dashboard-accent text-white shadow-sm'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        ID
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${language === 'en'
                                ? 'bg-dashboard-accent text-white shadow-sm'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        EN
                    </button>
                </div>

                {/* Backdrop to close search */}
                {showResults && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowResults(false)} />}
            </div>
        </header>
    );
};

export default Header;
