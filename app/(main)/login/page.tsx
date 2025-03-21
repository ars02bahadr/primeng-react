'use client';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { login } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store/store';
import ErrorService from '../../shared/ErrorService';

const LoginPage = () => {
    const [emailOrUserName, setEmailOrUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toastRef = useRef<Toast>(null);

    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (toastRef.current) {
            ErrorService.setToastInstance(toastRef.current);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
       try{
        await dispatch(login({ emailOrUserName, password })).unwrap();
        setLoading(false);
        router.push('/pages/empty');
        toastRef.current?.show({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Giriş yapıldı'
        });
       } catch (error: any) {
        console.log(error);
       } finally {
        setLoading(false);
       }
    };

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <Toast ref={toastRef} />
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Hoşgeldiniz!</div>
                            <span className="text-600 font-medium">Giriş yapmak için bilgilerinizi giriniz</span>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className="flex flex-column gap-3">
                                <span className="p-input-icon-left w-full">
                                    <i className="pi pi-user" />
                                    <InputText
                                        value={emailOrUserName}
                                        onChange={(e) => setEmailOrUserName(e.target.value)}
                                        placeholder="Kullanıcı Adı"
                                        className="w-full"
                                        required
                                    />
                                </span>

                                <span className="p-input-icon-left w-full">
                                    <i className="pi pi-lock" />
                                    <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                                </span>

                                <Button
                                    label="Giriş Yap"
                                    className="w-full"
                                    loading={loading}
                                    type="submit"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;