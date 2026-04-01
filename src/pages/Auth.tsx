import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Eye, EyeOff, AlertCircle, Mail, Lock, ArrowLeft } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { z } from 'zod';

const emailLoginSchema = z.object({
  email: z.string().email('Email manzili noto\'g\'ri'),
  password: z.string().min(6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
});

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { user, isLoading, signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string })?.returnTo || '/';
  const autoTriggerGoogle = new URLSearchParams(location.search).get('trial') === 'true';

  useEffect(() => {
    if (!isLoading && !user && autoTriggerGoogle && !isGoogleLoading) {
      handleGoogleLogin();
    }
  }, [isLoading, user, autoTriggerGoogle]);

  useEffect(() => {
    if (!isLoading && user) {
      navigate(returnTo, { replace: true });
    }
  }, [user, isLoading, navigate, returnTo]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      emailLoginSchema.parse({ email, password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    setIsSubmitting(true);
    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        setError('Email yoki parol noto\'g\'ri');
      } else if (signInError.message.includes('Email not confirmed')) {
        setError('Email tasdiqlanmagan. Emailingizni tekshiring');
      } else {
        setError(signInError.message);
      }
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);
    const { error: googleError } = await signInWithGoogle();
    if (googleError) {
      setError('Google orqali kirish xatolik yuz berdi');
      setIsGoogleLoading(false);
    }
  };

  if (isLoading || user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, hsl(220,72%,9%) 0%, hsl(225,65%,16%) 100%)" }}
      >
        <div className="w-10 h-10 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Kirish yoki Ro'yxatdan o'tish"
        description="AVTOTEST PREMIUM hisobingizga kiring yoki yangi hisob oching."
        path="/auth"
        noIndex={true}
      />

      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(220,72%,9%) 0%, hsl(225,65%,16%) 60%, hsl(220,60%,12%) 100%)",
        }}
      >
        {/* Background dots */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow blobs */}
        <div
          className="absolute top-[-10%] left-[-5%] w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #1d4ed8, transparent)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #d97706, transparent)" }}
        />

        {/* Back button */}
        <div className="relative w-full max-w-md mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/50 hover:text-white/80 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Bosh sahifa
          </button>
        </div>

        {/* Card */}
        <div
          className="relative w-full max-w-md rounded-3xl p-8 border"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px)",
            borderColor: "rgba(255,255,255,0.10)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
          }}
        >
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex flex-col items-center w-full mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1d4ed8, #1e40af)" }}
            >
              <img src="/logo-premium.png" alt="Logo" className="w-12 h-12 object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-black tracking-wide">
                <span className="text-white">AVTO</span>
                <span className="text-amber-400">TEST</span>
                <span className="text-white"> PREMIUM</span>
              </h1>
              <p className="text-white/40 text-sm mt-1">Imtihonga mukammal tayyorgarlik</p>
            </div>
          </button>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="h-12 pl-10 rounded-xl text-white placeholder:text-white/25 border-white/10 bg-white/5 focus:border-blue-500/50 focus:bg-white/8"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-password" className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                Parol
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Parolni kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="h-12 pl-10 pr-11 rounded-xl text-white placeholder:text-white/25 border-white/10 bg-white/5 focus:border-blue-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)" }}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Tekshirilmoqda...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Kirish
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-white/25 text-xs uppercase tracking-widest">yoki</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isSubmitting}
            className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all disabled:opacity-60 border border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            {isGoogleLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Google orqali...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google orqali kirish
              </>
            )}
          </button>

          {/* Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/pro')}
              className="text-sm text-amber-400/80 hover:text-amber-400 font-medium transition-colors"
            >
              Akkaunt ochish
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
