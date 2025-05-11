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
            <div className="w3-container w3-center w3-padding-32" style={{ width: '50%', margin: 'auto' }}>
                <h2 className="w3-text-custom-yellow">Forgot password</h2>
                <p>Enter your email to receive a password reset link</p>

                {status && <div className="w3-panel w3-green w3-round w3-margin-top">{status}</div>}

                <form onSubmit={submit} className="w3-container w3-card-4 w3-round-xlarge w3-custom-blue-l5 w3-text-black w3-margin-top">
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
                            className="w3-input w3-border"
                        />
                        {errors.email && <div className="w3-text-red">{errors.email}</div>}
                    </div>

                    <button type="submit" className="w3-btn w3-custom-blue-l1 w3-section w3-padding w3-right" disabled={processing}>
                        {processing ? 'Sending...' : 'Email password reset link'}
                    </button>
                </form>

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
