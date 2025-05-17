import W3Layout from '@/layouts/w3-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        email: string;
        password: string;
        remember: boolean;
    }>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <W3Layout>
            <Head title="Log in" />
            <div className="w3-container w3-padding-32 w3-center" style={{ width: '100%', maxWidth: 480, margin: 'auto' }}>
                <div className="w3-card w3-white w3-round-large w3-padding-large w3-margin-bottom w3-animate-opacity" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div className="w3-border-bottom w3-padding-bottom w3-margin-bottom">
                        <h2 className="w3-text-theme w3-margin-bottom-0" style={{ fontWeight: 600 }}>Log in to your account!</h2>
                        <span className="w3-text-grey" style={{ fontSize: '0.95em' }}>Access your WealthCraft dashboard</span>
                    </div>
                    {status && <div className="w3-panel w3-green w3-round">{status}</div>}
                    <form className="w3-container" onSubmit={submit}>
                        <div className="w3-row w3-section">
                            <label htmlFor="email" className="w3-text-black w3-left">Email address</label>
                            <input
                                id="email"
                                className="w3-input w3-border w3-round"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                disabled={processing}
                            />
                            {errors.email && <div className="w3-text-red">{errors.email}</div>}
                        </div>
                        <div className="w3-row w3-section">
                            <div className="w3-left w3-text-black">
                                <label htmlFor="password">Password</label>
                            </div>
                            {canResetPassword && (
                                <a href={route('password.request')} className="w3-right w3-text-blue" tabIndex={5}>
                                    Forgot password?
                                </a>
                            )}
                            <input
                                id="password"
                                className="w3-input w3-border w3-round"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                                disabled={processing}
                            />
                            {errors.password && <div className="w3-text-red">{errors.password}</div>}
                        </div>
                        <div className="w3-row w3-section w3-left-align">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={() => setData('remember', !data.remember)}
                                tabIndex={3}
                                className="w3-check"
                                disabled={processing}
                            />
                            <label htmlFor="remember"> Remember me</label>
                        </div>
                        <button type="submit" className="w3-btn w3-theme w3-round w3-section w3-padding w3-right" tabIndex={4} disabled={processing}>
                            {processing ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>
                </div>
                <div className="w3-center w3-text-black w3-small">
                    Don't have an account?{' '}
                    <a href={route('register')} className="w3-text-blue" tabIndex={5}>
                        Sign up
                    </a>
                </div>
            </div>
        </W3Layout>
    );
}
