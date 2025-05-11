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
            <div className="w3-container w3-center w3-padding-32">
                <h2>Reset password</h2>
                <p>Please enter your new password below</p>

                <form onSubmit={submit} className="w3-container w3-card-4 w3-light-grey w3-text-black w3-margin">
                    <div className="w3-row w3-section">
                        <label htmlFor="email" className="w3-text-black w3-left">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={data.email}
                            readOnly
                            className="w3-input w3-border"
                            onChange={(e) => setData('email', e.target.value)}
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
                            className="w3-input w3-border"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
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
                            className="w3-input w3-border"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Confirm password"
                        />
                        {errors.password_confirmation && <div className="w3-text-red">{errors.password_confirmation}</div>}
                    </div>

                    <button type="submit" className="w3-button w3-block w3-red w3-section w3-padding" disabled={processing}>
                        {processing ? 'Resetting password...' : 'Reset password'}
                    </button>
                </form>
            </div>
        </>
    );
}
