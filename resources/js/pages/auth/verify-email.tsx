import { Head, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Email verification" />
            <div className="w3-container w3-center w3-padding-32" style={{ width: '100%', maxWidth: 480, margin: 'auto' }}>
                <div className="w3-card w3-white w3-round-large w3-padding-large w3-margin-bottom w3-animate-opacity" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div className="w3-border-bottom w3-padding-bottom w3-margin-bottom">
                        <h2 className="w3-text-theme w3-margin-bottom-0" style={{ fontWeight: 600 }}>Verify email</h2>
                        <span className="w3-text-grey" style={{ fontSize: '0.95em' }}>Please verify your email address by clicking on the link we just emailed to you.</span>
                    </div>
                    <p>Once you have clicked the verification link (you may have to click multiple times) sent to your email, please go ahead and refresh this page!</p>
                    {status === 'verification-link-sent' && (
                        <div className="w3-panel w3-yellow w3-round w3-margin-top">
                            A new verification link has been sent to the email address you provided during registration.
                        </div>
                    )}
                    <form onSubmit={submit} className="w3-container w3-margin-top">
                        <button type="submit" className="w3-btn w3-theme w3-round w3-section w3-padding w3-right" disabled={processing}>
                            {processing ? 'Sending...' : 'Resend verification email'}
                        </button>
                    </form>
                    <form method="post" action={route('logout')} className="w3-container w3-margin-top">
                        <button type="submit" className="w3-btn w3-light-grey w3-round w3-section w3-padding w3-right">
                            Log out
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
