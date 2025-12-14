
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Check, X } from "lucide-react";

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Password requirements state
    const [checks, setChecks] = useState({
        length: false,
        letter: false,
        number: false,
        symbol: false
    });

    const { signup } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setChecks({
            length: password.length >= 8,
            letter: /[a-zA-Z]/.test(password),
            number: /[0-9]/.test(password),
            symbol: /[^a-zA-Z0-9]/.test(password)
        });
    }, [password]);

    const isPasswordValid = Object.values(checks).every(Boolean);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast.error("Password tidak aman", {
                description: "Mohon penuhi semua kriteria password."
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Password tidak cocok", {
                description: "Konfirmasi password harus sama dengan password."
            });
            return;
        }

        setIsLoading(true);
        try {
            await signup(email, password);
            toast.success("Akun berhasil dibuat", {
                description: "Selamat datang di Real Measure!"
            });
            navigate('/');
        } catch (error: any) {
            console.error(error);
            let msg = "Gagal membuat akun";
            if (error.code === 'auth/email-already-in-use') {
                msg = "Email sudah terdaftar";
            }
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Daftar Akun Baru</CardTitle>
                    <CardDescription className="text-center">
                        Buat akun untuk mulai menggunakan aplikasi
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@contoh.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {/* Password Requirements Checklist */}
                            <div className="text-xs space-y-1 mt-2 p-3 bg-slate-50 rounded-md border text-muted-foreground">
                                <p className="font-medium mb-2">Syarat Password:</p>
                                <Requirement label="Minimal 8 karakter" met={checks.length} />
                                <Requirement label="Mengandung huruf" met={checks.letter} />
                                <Requirement label="Mengandung angka" met={checks.number} />
                                <Requirement label="Mengandung simbol asing (!@#$%^&*)" met={checks.symbol} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={isLoading || !isPasswordValid}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Daftar Sekarang
                        </Button>
                        <div className="text-center text-sm">
                            Sudah punya akun?{" "}
                            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">
                                Masuk
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

function Requirement({ label, met }: { label: string, met: boolean }) {
    return (
        <div className={`flex items-center gap-2 ${met ? 'text-green-600' : 'text-slate-500'}`}>
            {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            <span>{label}</span>
        </div>
    );
}
