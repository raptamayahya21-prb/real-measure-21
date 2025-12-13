
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Clock, Activity, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
    const { t, language } = useLanguage();

    return (
        <div className="space-y-8">
            {/* Intro Section - Hero Style */}
            <div className="relative pt-8 pb-12 flex flex-col items-center text-center space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-dashboard-accent/30 bg-dashboard-accent/10 text-dashboard-accent text-xs font-medium tracking-wide uppercase mb-2">
                    {language === 'en' ? 'Differential Calculus' : 'Kalkulus Diferensial'}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-dashboard-text tracking-tight max-w-4xl leading-tight">
                    {language === 'en' ? 'All-in-one Education Solution' : 'Solusi Pendidikan All-in-one'} <br />
                    <span className="text-dashboard-accent">{t('app.title')}</span>
                </h1>
                <p className="text-lg md:text-xl text-dashboard-text-muted max-w-2xl leading-relaxed">
                    {t('home.subtitle')}
                </p>
                <div className="flex gap-4 pt-4">
                    <NavLink to="/measure">
                        <Button size="lg" className="rounded-full px-8 bg-dashboard-accent hover:bg-dashboard-accent/90 text-white shadow-lg shadow-dashboard-accent/30">
                            {t('home.start_measure')}
                        </Button>
                    </NavLink>
                    <NavLink to="/learning">
                        <Button size="lg" variant="outline" className="rounded-full px-8 border-slate-200 hover:bg-slate-50 text-dashboard-text">
                            {t('home.start_learning')}
                        </Button>
                    </NavLink>
                </div>
            </div>

            {/* Feature Cards Grid - Matches 'Signal-based marketing' style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Statistics Card */}
                <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-1 transition-all hover:border-dashboard-accent/50 shadow-sm hover:shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-dashboard-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative h-full rounded-[20px] bg-white p-6 md:p-8">
                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-dashboard-accent/10 text-dashboard-accent">
                            <Activity className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-dashboard-text">{t('home.history.title')}</h3>
                        <p className="mb-6 text-sm leading-relaxed text-dashboard-text-muted">
                            {t('home.history.desc')}
                        </p>

                        {/* Placeholder Graph Area */}
                        <div className="h-32 w-full rounded-xl border border-dashed border-slate-200 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 flex items-end justify-around px-4 pb-2 opacity-30">
                                <div className="w-8 h-1/3 bg-dashboard-accent rounded-t" />
                                <div className="w-8 h-2/3 bg-dashboard-accent-blue rounded-t" />
                                <div className="w-8 h-1/2 bg-dashboard-accent rounded-t" />
                                <div className="w-8 h-3/4 bg-dashboard-accent-blue rounded-t" />
                            </div>
                            <span className="relative text-xs text-dashboard-text-muted">
                                {language === 'en' ? 'No data yet' : 'Belum ada data'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Challenge/Important Card */}
                <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-1 transition-all hover:border-dashboard-accent-blue/50 shadow-sm hover:shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-dashboard-accent-blue/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative h-full rounded-[20px] bg-white p-6 md:p-8">
                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-dashboard-accent-blue/10 text-dashboard-accent-blue">
                            <Clock className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-dashboard-text">
                            {language === 'en' ? 'Daily Challenge' : 'Challenge Harian'}
                        </h3>
                        <p className="mb-6 text-sm leading-relaxed text-dashboard-text-muted">
                            {language === 'en' ? 'Challenge yourself with daily quizzes on real numbers and calculus.' : 'Tantang diri Anda dengan kuis harian seputar bilangan real dan kalkulus.'}
                        </p>
                        <div className="mt-auto">
                            <NavLink to="/challenge">
                                <Button className="w-full bg-dashboard-accent-blue/10 text-dashboard-accent-blue hover:bg-dashboard-accent-blue hover:text-white border border-dashboard-accent-blue/20 transition-all">
                                    {language === 'en' ? 'Start Challenge' : 'Mulai Tantangan'}
                                </Button>
                            </NavLink>
                        </div>
                    </div>
                </div>

                {/* Learning Materials Card - Full Width or separate */}
                <div className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-1 transition-all hover:border-purple-500/50 shadow-sm hover:shadow-md">
                    <div className="relative h-full rounded-[20px] bg-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1 space-y-4">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-dashboard-text">{t('home.features.learn')}</h3>
                                <p className="text-dashboard-text-muted mt-2 max-w-xl">
                                    {t('home.features.learn.desc')}
                                </p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-500">
                                    {language === 'en' ? 'Theorems' : 'Teorema'}
                                </div>
                                <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-500">
                                    {language === 'en' ? 'Definitions' : 'Definisi'}
                                </div>
                                <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-500">
                                    {language === 'en' ? 'Examples' : 'Contoh Soal'}
                                </div>
                            </div>
                        </div>
                        <NavLink to="/learning">
                            <Button size="lg" variant="ghost" className="group/btn text-dashboard-text hover:text-dashboard-accent hover:bg-slate-50">
                                {language === 'en' ? 'View All' : 'Lihat Semua'} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
