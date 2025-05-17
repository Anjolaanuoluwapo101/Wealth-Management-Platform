import W3Layout from '@/layouts/w3-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        dob: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <W3Layout>
            <Head title="Register" />
            <div className="w3-container w3-center w3-padding-32" style={{ width: '100%', maxWidth: 480, margin: 'auto' }}>
                <div className="w3-card w3-white w3-round-large w3-padding-large w3-margin-bottom w3-animate-opacity" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div className="w3-border-bottom w3-padding-bottom w3-margin-bottom">
                        <h2 className="w3-text-theme w3-margin-bottom-0" style={{ fontWeight: 600 }}>Create an account</h2>
                        <span className="w3-text-grey" style={{ fontSize: '0.95em' }}>Sign up to access WealthCraft</span>
                    </div>
                    <form className="w3-container" onSubmit={submit}>
                        <div className="w3-row w3-section">
                            <label htmlFor="name" className="w3-text-black w3-left">Name</label>
                            <input
                                id="name"
                                className="w3-input w3-border w3-round"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Full name"
                            />
                            {errors.name && <div className="w3-text-red">{errors.name}</div>}
                        </div>
                        <div className="w3-row w3-section">
                            <label htmlFor="dob" className="w3-text-black w3-left">Date of Birth</label>
                            <input
                                id="dob"
                                className="w3-input w3-border w3-round"
                                type="date"
                                required
                                tabIndex={2}
                                autoComplete="dob"
                                value={data.dob}
                                onChange={(e) => setData('dob', e.target.value)}
                                disabled={processing}
                                placeholder=""
                            />
                            {errors.dob && <div className="w3-text-red">{errors.dob}</div>}
                        </div>
                        <div className="w3-row w3-section">
                            <label htmlFor="email" className="w3-text-black w3-left">Email address</label>
                            <input
                                id="email"
                                className="w3-input w3-border w3-round"
                                type="email"
                                required
                                tabIndex={3}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                            />
                            {errors.email && <div className="w3-text-red">{errors.email}</div>}
                        </div>
                        <div className="w3-row w3-section">
                            <label htmlFor="phone" className="w3-text-black w3-left">Mobile Number</label>
                            <input
                                id="phone"
                                className="w3-input w3-border w3-round"
                                type="tel"
                                required
                                tabIndex={4}
                                autoComplete="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                disabled={processing}
                                placeholder="1234567890"
                            />
                            {errors.phone && <div className="w3-text-red">{errors.phone}</div>}
                        </div>
                        <div className="w3-row w3-section">
                            <label htmlFor="password" className="w3-text-black w3-left">Password</label>
                            <input
                                id="password"
                                className="w3-input w3-border w3-round"
                                type="password"
                                required
                                tabIndex={5}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                            />
                            {errors.password && <div className="w3-text-red">{errors.password}</div>}
                        </div>
                        <div className="w3-row w3-section">
                            <label htmlFor="password_confirmation" className="w3-text-black w3-left">Confirm password</label>
                            <input
                                id="password_confirmation"
                                className="w3-input w3-border w3-round"
                                type="password"
                                required
                                tabIndex={6}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                            />
                            {errors.password_confirmation && <div className="w3-text-red">{errors.password_confirmation}</div>}
                        </div>
                        <button type="submit" className="w3-btn w3-theme w3-round w3-section w3-padding w3-right" tabIndex={7} disabled={processing}>
                            {processing ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>
                </div>
                <div className="w3-center w3-text-black w3-small">
                    Already have an account?{' '}
                    <a href={route('login')} className="w3-text-blue" tabIndex={8}>
                        Log in
                    </a>
                </div>
            </div>
        </W3Layout>
    );
}

