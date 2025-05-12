// // Components
// import { Head, useForm } from '@inertiajs/react';
// import { LoaderCircle } from 'lucide-react';
// import { FormEventHandler } from 'react';

// import TextLink from '@/components/text-link';
// import { Button } from '@/components/ui/button';
// import AuthLayout from '@/layouts/auth-layout';

// export default function VerifyEmail({ status }: { status?: string }) {
//     const { post, processing } = useForm({});

//     const submit: FormEventHandler = (e) => {
//         e.preventDefault();

//         post(route('verification.send'));
//     };

//     return (
//         <AuthLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
//             <Head title="Email verification" />

//             {status === 'verification-link-sent' && (
//                 <div className="mb-4 text-center text-sm font-medium text-green-600">
//                     A new verification link has been sent to the email address you provided during registration.
//                 </div>
//             )}

//             <form onSubmit={submit} className="space-y-6 text-center">
//                 <Button disabled={processing} variant="secondary">
//                     {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
//                     Resend verification email
//                 </Button>

//                 <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
//                     Log out
//                 </TextLink>
//             </form>
//         </AuthLayout>
//     );
// }


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
            <div className="w3-container w3-center w3-padding-32" style={{ width: '80%', margin: 'auto' }}>
                <h2 className="w3-text-custom-yellow">Verify email</h2>
                <p>Please verify your email address by clicking on the link we just emailed to you.</p>
                <br />
                <p> Once you have clicked the verification link (you may have to click multiple times) sent to your email, Please go ahead an refresh this page!</p>

                {status === 'verification-link-sent' && (
                    <div className="w3-panel w3-green w3-round w3-margin-top">
                        A new verification link has been sent to the email address you provided during registration.
                    </div>
                )}

                <form onSubmit={submit} className="w3-container w3-card-4 w3-round-xlarge w3-custom-blue-l5 w3-text-black w3-margin-top">
                    <button type="submit" className="w3-btn w3-custom-blue-l1 w3-section w3-padding w3-right" disabled={processing}>
                        {processing ? 'Sending...' : 'Resend verification email'}
                    </button>
                </form>

                <form method="post" action={route('logout')} className="w3-container w3-card-4 w3-round-xlarge w3-custom-blue-l5 w3-text-black w3-margin-top">
                    <button type="submit" className="w3-btn w3-light-grey w3-section w3-padding w3-right">
                        Log out
                    </button>
                </form>
            </div>
        </>
    );
}
