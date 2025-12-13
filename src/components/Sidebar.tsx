
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ruler, BookOpen, Trophy, History, Settings, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
    const { t, language } = useLanguage();

    const navItems = [
        { path: '/', label: 'nav.home', icon: LayoutDashboard }, // Beranda
        { path: '/measure', label: 'nav.measure', icon: Ruler }, // Ukur
        { path: '/learning', label: 'nav.learning', icon: BookOpen }, // Pembelajaran
        { path: '/challenge', label: language === 'en' ? 'Daily Challenge' : 'Tantangan Harian', icon: Trophy }, // Challenge
        { path: '/history', label: 'nav.history', icon: History }, // Riwayat
        { path: '/settings', label: 'nav.settings', icon: Settings }, // Pengaturan
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-dashboard-panel/50 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-dashboard-accent font-bold text-2xl">
                        {/* Logo Icon Placeholder if needed, or just text */}
                        <span>Real Measure</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 group mx-2",
                                    isActive
                                        ? "bg-dashboard-accent/10 text-dashboard-accent shadow-sm border border-dashboard-accent/20"
                                        : "text-dashboard-text-muted hover:bg-black/5 hover:text-dashboard-text"
                                )
                            }
                        >
                            <item.icon className={cn("w-5 h-5")} />
                            <span className="font-medium">{t(item.label)}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    {/* Optional footer content */}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
