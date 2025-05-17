// Components
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Confirm password" />
            <div className="w3-container w3-center w3-padding-32" style={{ width: '100%', maxWidth: 480, margin: 'auto' }}>
                <div className="w3-card w3-white w3-round-large w3-padding-large w3-margin-bottom w3-animate-opacity" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div className="w3-border-bottom w3-padding-bottom w3-margin-bottom">
                        <h2 className="w3-text-theme w3-margin-bottom-0" style={{ fontWeight: 600 }}>Confirm your password</h2>
                        <span className="w3-text-grey" style={{ fontSize: '0.95em' }}>This is a secure area of the application. Please confirm your password before continuing.</span>
                    </div>
                    <form onSubmit={submit} className="w3-container">
                        <div className="w3-row w3-section">
                            <label htmlFor="password" className="w3-text-black w3-left">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                value={data.password}
                                autoFocus
                                className="w3-input w3-border w3-round"
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                            />
                            {errors.password && <div className="w3-text-red">{errors.password}</div>}
                        </div>
                        <button type="submit" className="w3-btn w3-theme w3-round w3-section w3-padding w3-right" disabled={processing}>
                            {processing ? 'Confirming...' : 'Confirm password'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
