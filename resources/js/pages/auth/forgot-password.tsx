import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot password" />
            <div className="w3-container w3-center w3-padding-32" style={{ width: '100%', maxWidth: 480, margin: 'auto' }}>
                <div className="w3-card w3-white w3-round-large w3-padding-large w3-margin-bottom w3-animate-opacity" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div className="w3-border-bottom w3-padding-bottom w3-margin-bottom">
                        <h2 className="w3-text-theme w3-margin-bottom-0" style={{ fontWeight: 600 }}>Forgot password</h2>
                        <span className="w3-text-grey" style={{ fontSize: '0.95em' }}>Enter your email to receive a password reset link</span>
                    </div>
                    {status && <div className="w3-panel w3-green w3-round w3-margin-top">{status}</div>}
                    <form onSubmit={submit} className="w3-container">
                        <div className="w3-row w3-section">
                            <label htmlFor="email" className="w3-text-black w3-left">Email address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="off"
                                value={data.email}
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                className="w3-input w3-border w3-round"
                                disabled={processing}
                            />
                            {errors.email && <div className="w3-text-red">{errors.email}</div>}
                        </div>
                        <button type="submit" className="w3-btn w3-theme w3-round w3-section w3-padding w3-right" disabled={processing}>
                            {processing ? 'Sending...' : 'Email password reset link'}
                        </button>
                    </form>
                </div>
                <div className="w3-center w3-text-black w3-small w3-margin-top">
                    Or, return to{' '}
                    <a href={route('login')} className="w3-text-blue">
                        log in
                    </a>
                </div>
            </div>
        </>
    );
}
