import { type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type ProfileForm = {
    name: string;
    email: string;
    pan_card: string;
    address_proof: File | string | null;
    bank_proof: File | string | null;
    self_photograph: File |string |  null;
    kyc_verified: boolean;
    questions_answers: string[];
};

const questionsList = [
    "What is your favorite color?",
    "What city were you born in?",
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What is your favorite food?",
    "What was your high school mascot?",
    "What is your favorite movie?",
    "What is your dream job?",
    "What is your favorite hobby?",
    "What is your favorite book?",
];

export default function Profile() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, errors, processing } = useForm<ProfileForm>({
        name: typeof auth.user.name === 'string' ? auth.user.name : '',
        email: typeof auth.user.email === 'string' ? auth.user.email : '',
        pan_card: typeof auth.user.pan_card === 'string' ? auth.user.pan_card : '',
        address_proof: typeof auth.user.address_proof === 'string' ? auth.user.address_proof : null,
        bank_proof: typeof auth.user.bank_proof === 'string' ? auth.user.bank_proof : null,
        self_photograph: typeof auth.user.self_photograph === 'string' ? auth.user.self_photograph : null,
        kyc_verified: typeof auth.user.kyc_verified === 'boolean' ? auth.user.kyc_verified : false,
        questions_answers: Array.isArray(auth.user.questions_answers)
            ? auth.user.questions_answers
            : JSON.parse(typeof auth.user.questions_answers === 'string' ? auth.user.questions_answers : '[]'),
    });

    console.log(data.questions_answers);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('pan_card', data.pan_card);
        if (data.address_proof) formData.append('address_proof', data.address_proof);
        if (data.bank_proof) formData.append('bank_proof', data.bank_proof);
        if (data.self_photograph) formData.append('self_photograph', data.self_photograph);
        formData.append('kyc_verified', String(data.kyc_verified)); // Send as string
        formData.append('questions_answers', JSON.stringify(data.questions_answers));

        post(route('profile.update'), {
            headers : {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            preserveScroll: true,
            onError: () => console.error('Error updating profile'),
        });

        // fetch(route('profile.update'), {
        //     method : 'POST',
        //     headers : {
        //         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        //         'Accept': 'application/json',
        //         // 'Content-Type' : 'multipart/form-data'
        //     },
        //     body : formData
        // }).then((response) => {
            
        // }).catch((error) => {
        //     console.log(error)
        // });
    };

    const handleFileChange = (field: keyof ProfileForm, file: File | null) => {
        setData(field, file);
    };

    const handleQuestionChange = (index: number, value: string) => {
        const updatedAnswers = [...data.questions_answers];
        updatedAnswers[index] = value;
        setData('questions_answers', updatedAnswers);
    };

    return (
        <>
            <Head title="Profile Settings" />
            <div className="w3-container w3-padding-16 w3-card-4 w3-light-grey w3-margin">
                <h2>Profile Information</h2>
                <p>Update your profile details and KYC information.</p>
                <form onSubmit={submit} encType="multipart/form-data">
                    <label htmlFor="name" className="w3-text-black">Name</label>
                    <input
                        id="name"
                        type="text"
                        className="w3-input w3-border w3-margin-bottom"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    {errors.name && <p className="w3-text-red">{errors.name}</p>}

                    <label htmlFor="email" className="w3-text-black">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="w3-input w3-border w3-margin-bottom"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && <p className="w3-text-red">{errors.email}</p>}

                    <label htmlFor="pan_card" className="w3-text-black">PAN Card</label>
                    <input
                        id="pan_card"
                        type="text"
                        className="w3-input w3-border w3-margin-bottom"
                        value={data.pan_card}
                        onChange={(e) => setData('pan_card', e.target.value)}
                    />
                    {errors.pan_card && <p className="w3-text-red">{errors.pan_card}</p>}

                    <label htmlFor="address_proof" className="w3-text-black">Address Proof</label>
                    <input
                        id="address_proof"
                        type="file"
                        className="w3-input w3-border w3-margin-bottom"
                        onChange={(e) => handleFileChange('address_proof', e.target.files?.[0] || null)}
                    />
                    {errors.address_proof && <p className="w3-text-red">{errors.address_proof}</p>}

                    <label htmlFor="bank_proof" className="w3-text-black">Bank Proof</label>
                    <input
                        id="bank_proof"
                        type="file"
                        className="w3-input w3-border w3-margin-bottom"
                        onChange={(e) => handleFileChange('bank_proof', e.target.files?.[0] || null)}
                    />
                    {errors.bank_proof && <p className="w3-text-red">{errors.bank_proof}</p>}

                    <label htmlFor="self_photograph" className="w3-text-black">Self Photograph</label>
                    <input
                        id="self_photograph"
                        type="file"
                        className="w3-input w3-border w3-margin-bottom"
                        onChange={(e) => handleFileChange('self_photograph', e.target.files?.[0] || null)}
                    />
                    {errors.self_photograph && <p className="w3-text-red">{errors.self_photograph}</p>}

                    <label htmlFor="kyc_verified" className="w3-text-black">KYC Verified</label>
                    <input
                        id="kyc_verified"
                        type="checkbox"
                        className="w3-check w3-margin-bottom"
                        checked={data.kyc_verified ?? false}
                        value= {data.kyc_verified ? '1' : '0'}
                        onChange={(e) => setData('kyc_verified', e.target.checked)}
                    />
                    {errors.kyc_verified && <p className="w3-text-red">{errors.kyc_verified}</p>}

                    <h3>Security Questions</h3>
                    {questionsList.map((question, index) => (
                        <div key={index} className="w3-margin-bottom">
                            <label htmlFor={`question_${index}`} className="w3-text-black">{question}</label>
                            <input
                                id={`question_${index}`}
                                type="text"
                                className="w3-input w3-border"
                                value={data.questions_answers[index] || ''}
                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                            />
                            {errors[`questions_answers.${index}` as keyof typeof errors] && (
                                <p className="w3-text-red">{errors[`questions_answers.${index}` as keyof typeof errors]}</p>
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w3-button w3-red w3-section w3-padding"
                        disabled={processing}
                    >
                        {processing ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </div>
        </>
    );
}
