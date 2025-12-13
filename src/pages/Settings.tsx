
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Globe, Moon, Sun, Languages, Cloud } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import TranslationDemo from '../components/TranslationDemo';

const Settings = () => {
    const { language, setLanguage, t } = useLanguage();
    const [isDarkMode, setIsDarkMode] = useState(false); // Placeholder for now, typically context
    const [apiKey, setApiKey] = useState('');

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-dashboard-accent mb-2">{t('settings.title')}</h1>
                <p className="text-slate-500">{t('settings.subtitle')}</p>
            </div>

            <div className="grid gap-6">
                {/* Language Settings */}
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-dashboard-accent">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">{t('settings.lang.title')}</CardTitle>
                                <CardDescription>{t('settings.lang.desc')}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Label className="flex flex-col gap-1">
                                <span>{t('settings.lang.label')}</span>
                                <span className="font-normal text-slate-500">{t('settings.lang.help')}</span>
                            </Label>
                            <Select value={language} onValueChange={(val: 'id' | 'en') => setLanguage(val)}>
                                <SelectTrigger className="w-[180px] rounded-full">
                                    <SelectValue placeholder="Pilih Bahasa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                                    <SelectItem value="en">English (US)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Offline Translation Feature */}
                        <div className="p-4 bg-dashboard-panel/50 rounded-xl border border-dashed border-dashboard-accent/20">
                            <div className="flex items-start gap-3">
                                <Cloud className="w-5 h-5 text-dashboard-accent mt-0.5" />
                                <div className="w-full">
                                    <h4 className="font-bold text-sm text-dashboard-accent mb-1">{t('settings.offline.title')}</h4>
                                    <p className="text-sm text-slate-500 mb-3">
                                        {t('settings.offline.desc')}
                                        <br /><em>Note: Download ~300MB at first use.</em>
                                    </p>

                                    <div className="space-y-3">
                                        <TranslationDemo />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>


            </div>
        </div>
    );
};

export default Settings;
