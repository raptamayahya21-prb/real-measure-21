import React, { useEffect, useState } from 'react';
import { getAllMeasurements, deleteMeasurement, MeasurementData } from '../lib/indexedDB';
import { useLanguage } from '../context/LanguageContext';
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';
import { id, enUS } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Calendar, Ruler, Trash2, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const History = () => {
    const { t, language } = useLanguage();
    const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
    const [loading, setLoading] = useState(true);

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus data ini?")) return;
        try {
            await deleteMeasurement(id);
            setMeasurements(prev => prev.filter(m => m.id !== id));
            toast.success("Data berhasil dihapus");
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus data");
        }
    };

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const data = await getAllMeasurements();
            // Sort by timestamp descending
            const sorted = data.sort((a, b) => {
                const dateA = new Date(a.timestamp || 0).getTime();
                const dateB = new Date(b.timestamp || 0).getTime();
                return dateB - dateA;
            });
            setMeasurements(sorted);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'PPpp', { locale: language === 'id' ? id : enUS });
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-3xl font-bold mb-8">{t('nav.history')}</h1>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : measurements.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <HistoryIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>{t('history.empty')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {measurements.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="p-4 md:p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dashboard-card border-slate-200 shadow-sm">
                                <div className="space-y-1">
                                    <div className="font-bold text-lg text-dashboard-text">
                                        {item.item_name || "Pengukuran Tanpa Nama"}
                                    </div>
                                    <div className="flex items-center gap-2 font-medium">
                                        <Ruler className="w-4 h-4 text-dashboard-accent" />
                                        <span className="text-dashboard-text">{item.measured_value.toFixed(2)} {item.unit}</span>
                                        {item.real_value && (
                                            <span className="text-dashboard-text-muted font-normal text-sm">vs Real {item.real_value.toFixed(2)} {item.unit}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-dashboard-text-muted">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(item.timestamp)}
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-2 text-xs text-dashboard-text-muted">
                                            <User className="w-3 h-3" />
                                            {item.user_email || "Unknown User"}
                                        </div>
                                        {item.error_percentage !== undefined && (
                                            <div className={`
                                            px-3 py-1 rounded-full text-xs font-bold font-mono border
                                            ${item.error_percentage < 5
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : item.error_percentage < 15
                                                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                        : 'bg-red-100 text-red-700 border-red-200'}
                                        `}>
                                                Error: {item.error_percentage.toFixed(2)}%
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full"
                                        onClick={() => handleDelete(item.id!)}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )
            }
        </div>
    );
};

// Simple icon wrapper if lucide History is already imported but to avoid name clash with page
const HistoryIcon = (props: any) => <Calendar {...props} />;

export default History;
