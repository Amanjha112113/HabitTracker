import React, { useState } from 'react';
import { api } from '../src/services/api';

interface AuthViewProps {
    onLogin: (user: any) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            let user;
            if (isLogin) {
                user = await api.login(formData.email, formData.password);
            } else {
                user = await api.register({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                });
            }
            onLogin(user);
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                poster="https://images.pexels.com/photos/853759/pexels-photo-853759.jpeg"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            >
                <source src="https://videos.pexels.com/video-files/853759/853759-hd_1280_720_25fps.mp4" type="video/mp4" />
            </video>
            {/* Overlay to darken video for contrast */}
            <div className="absolute top-0 left-0 w-full h-full bg-stone-900/40 backdrop-blur-[2px] z-0"></div>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl p-8 border border-white/50 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">GrowthPath</h1>
                    <p className="text-stone-600 font-bold">Build consistency. Master your craft.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1 mb-1 block">First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-700 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-stone-300"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1 mb-1 block">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-700 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-stone-300"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-700 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-stone-300"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1 mb-1 block">Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-700 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-stone-300"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold shadow-xl shadow-stone-900/20 hover:bg-stone-800 hover:scale-[1.02] active:scale-95 transition-all mt-6 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            isLogin ? "Sign In" : "Create Account"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <p className="text-stone-500 font-medium text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-teal-600 hover:text-teal-700 font-bold underline decoration-2 underline-offset-2 transition-colors"
                        >
                            {isLogin ? "Sign Up" : "Log In"}
                        </button>
                    </p>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-stone-200"></div>
                        <span className="flex-shrink mx-4 text-stone-300 text-xs font-bold uppercase tracking-widest">Dev Mode</span>
                        <div className="flex-grow border-t border-stone-200"></div>
                    </div>

                    <button
                        onClick={() => {
                            onLogin({
                                firstName: 'Guest',
                                lastName: 'Developer',
                                email: 'guest@dev.local',
                                avatar: 'https://ui-avatars.com/api/?name=Guest+Dev&background=random'
                            });
                        }}
                        type="button"
                        className="text-stone-400 hover:text-stone-600 font-bold text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        Continue as Guest (Skip Auth)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthView;
