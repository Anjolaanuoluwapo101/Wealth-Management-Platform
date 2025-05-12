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
        <>
            <Head title="Log in" />
            <div className="w3-container  w3-padding-32 w3-center" style={{ width: '80%' , margin : 'auto' }} >
                <h2 className='w3-text-custom-yellow'>Log in to your account!</h2>
                {status && <div className="w3-panel w3-green w3-round">{status}</div>}
                <form className="w3-container w3-card-4 w3-round-xlarge w3-custom-blue-l5 w3-text-black w3-margin" onSubmit={submit}>
                    <div className='w3-row w3-section' ></div>
                    <div className="w3-row w3-section">
                        <label htmlFor="email" className="w3-text-black w3-left">Email address</label>
                        <input
                            id="email"
                            className="w3-input"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />
                       
                    </div>

                    <div className='w3-row w3-section' ><br /> </div>

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
                            className="w3-input"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                        />
                        {errors.password && <div className="w3-text-red">{errors.password}</div>}
                        {errors.email && <div className="w3-text-red">{errors.email}</div>}
                    </div>

                    <div className="w3-row w3-section w3-left-align">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={data.remember}
                            onChange={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="w3-check"
                        />
                        <label htmlFor="remember"> Remember me</label>
                    </div>

                    <button type="submit" className="w3-btn w3-right w3-custom-blue-l1 w3-section w3-padding" tabIndex={4} disabled={processing}>
                        {processing ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <div className="w3-center w3-text-black w3-small">
                    Don't have an account?{' '}
                    <a href={route('register')} className="w3-text-blue" tabIndex={5}>
                        Sign up
                    </a>
                </div>
            </div>
        </>
    );
}
