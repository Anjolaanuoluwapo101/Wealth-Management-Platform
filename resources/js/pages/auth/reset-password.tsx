import { Head, useForm } from '@inertiajs/react';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset password" />
            <div className="w3-container w3-center w3-padding-32" style={{ width: '100%', maxWidth: 480, margin: 'auto' }}>
                <div className="w3-card w3-white w3-round-large w3-padding-large w3-margin-bottom w3-animate-opacity" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div className="w3-border-bottom w3-padding-bottom w3-margin-bottom">
                        <h2 className="w3-text-theme w3-margin-bottom-0" style={{ fontWeight: 600 }}>Reset password</h2>
                        <span className="w3-text-grey" style={{ fontSize: '0.95em' }}>Please enter your new password below</span>
                    </div>
                    <form onSubmit={submit} className="w3-container">
                        <div className="w3-row w3-section">
                            <label htmlFor="email" className="w3-text-black w3-left">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={data.email}
                                readOnly
                                className="w3-input w3-border w3-round"
                                onChange={(e) => setData('email', e.target.value)}
                                disabled
                            />
                            {errors.email && <div className="w3-text-red">{errors.email}</div>}
                        </div>
                        <div className="w3-row w3-section">
                            <label htmlFor="password" className="w3-text-black w3-left">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                value={data.password}
                                autoFocus
                                className="w3-input w3-border w3-round"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                                disabled={processing}
                            />
                            {errors.password && <div className="w3-text-red">{errors.password}</div>}
                        </div>
                        <div className="w3-row w3-section">
                            <label htmlFor="password_confirmation" className="w3-text-black w3-left">Confirm password</label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                className="w3-input w3-border w3-round"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm password"
                                disabled={processing}
                            />
                            {errors.password_confirmation && <div className="w3-text-red">{errors.password_confirmation}</div>}
                        </div>
                        <button type="submit" className="w3-btn w3-theme w3-round w3-section w3-padding w3-right" disabled={processing}>
                            {processing ? 'Resetting password...' : 'Reset password'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
