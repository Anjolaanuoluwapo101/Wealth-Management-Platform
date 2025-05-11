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
            <div className="w3-container w3-center w3-padding-32" style={{ maxWidth: '400px', margin: 'auto' }}>
                <h2>Confirm your password</h2>
                <p>This is a secure area of the application. Please confirm your password before continuing.</p>

                <form onSubmit={submit} className="w3-container w3-card-4 w3-light-grey w3-text-black w3-margin-top">
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
                            className="w3-input w3-border"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && <div className="w3-text-red">{errors.password}</div>}
                    </div>

                    <button type="submit" className="w3-button w3-block w3-red w3-section w3-padding" disabled={processing}>
                        {processing ? 'Confirming...' : 'Confirm password'}
                    </button>
                </form>
            </div>
        </>
    );
}
