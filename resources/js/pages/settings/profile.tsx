import { type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import React, { useState } from 'react';

type ProfileForm = {
    name: string;
    email: string;
    pan_card: string;
    address_proof: File | string | null;
    bank_proof: File | string | null;
    self_photograph: File | string | null;
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

    const [questionIndex, setQuestionIndex] = useState(0);
    const totalQuestions = questionsList.length;

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
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            preserveScroll: true,
            onError: () => console.error('Error updating profile'),
        });

    };

    const handleFileChange = (field: keyof ProfileForm, file: File | null) => {
        setData(field, file);
    };

    const handleQuestionChange = (index: number, value: string) => {
        const updatedAnswers = [...data.questions_answers];
        updatedAnswers[index] = value;
        setData('questions_answers', updatedAnswers);
    };

    const isStoredImage = (value: File | string | null): value is string => {
        return true;
    };

    return (
        <>
            <Head title="Profile Settings" />
            <div className="w3-container w3-padding-32" style={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
                <div className="w3-card w3-white w3-round-large w3-padding-large w3-margin-bottom w3-animate-opacity" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div className="w3-border-bottom w3-padding-bottom w3-margin-bottom w3-center">
                        <h2 className="w3-text-theme w3-margin-bottom-0" style={{ fontWeight: 600 }}>Profile Information</h2>
                        <span className="w3-text-grey" style={{ fontSize: '0.95em' }}>Update your profile details and KYC information.</span>
                    </div>
                    <form onSubmit={submit} encType="multipart/form-data" className="w3-container">
                        <div className="w3-row w3-section">
                            <label htmlFor="name" className="w3-text-black w3-left">Name</label>
                            <input
                                id="name"
                                type="text"
                                className="w3-input w3-border w3-round"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="w3-text-red">{errors.name}</p>}
                        </div>
                        <div className="w3-row w3-section">
                            <label htmlFor="email" className="w3-text-black w3-left">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="w3-input w3-border w3-round"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="w3-text-red">{errors.email}</p>}
                        </div>
                        <div className="w3-row w3-section">
                            <label htmlFor="pan_card" className="w3-text-black w3-left">PAN Card</label>
                            <input
                                id="pan_card"
                                type="text"
                                className="w3-input w3-border w3-round"
                                value={data.pan_card}
                                onChange={(e) => setData('pan_card', e.target.value)}
                            />
                            {errors.pan_card && <p className="w3-text-red">{errors.pan_card}</p>}
                        </div>
                        <div className="w3-row w3-section">
                            <label htmlFor="address_proof" className="w3-text-black w3-left"><b>Address Proof</b></label>
                            <input
                                id="address_proof"
                                type="file"
                                className="w3-input w3-border w3-round"
                                onChange={(e) => handleFileChange('address_proof', e.target.files?.[0] || null)}
                            />
                            {errors.address_proof && <p className="w3-text-red">{errors.address_proof}</p>}
                            {isStoredImage(data.address_proof) && (
                                <div className="w3-margin-bottom">
                                    <img src={'/storage/' + data.address_proof} alt="Address Proof" className="w3-image w3-round-large" style={{ maxWidth: '200px' }} />
                                </div>
                            )}
                        </div>
                        <div className="w3-row w3-section">
                            <label htmlFor="bank_proof" className="w3-text-black w3-left"><b>Bank Proof</b></label>
                            <input
                                id="bank_proof"
                                type="file"
                                className="w3-input w3-border w3-round"
                                onChange={(e) => handleFileChange('bank_proof', e.target.files?.[0] || null)}
                            />
                            {errors.bank_proof && <p className="w3-text-red">{errors.bank_proof}</p>}
                            {isStoredImage(data.bank_proof) && (
                                <div className="w3-margin-bottom">
                                    <img src={'/storage/' + data.bank_proof} alt="Bank Proof" className="w3-image w3-round-large" style={{ maxWidth: '200px' }} />
                                </div>
                            )}
                        </div>
                        <div className="w3-row w3-section">
                            <label htmlFor="self_photograph" className="w3-text-black w3-left"><b>Self Photograph</b></label>
                            <input
                                id="self_photograph"
                                type="file"
                                className="w3-input w3-border w3-round"
                                onChange={(e) => handleFileChange('self_photograph', e.target.files?.[0] || null)}
                            />
                            {errors.self_photograph && <p className="w3-text-red">{errors.self_photograph}</p>}
                            {isStoredImage(data.self_photograph) && (
                                <div className="w3-margin-bottom">
                                    <img src={'/storage/' + data.self_photograph} alt="Self Photograph" className="w3-image w3-round-large" style={{ maxWidth: '200px' }} />
                                </div>
                            )}
                        </div>
                        <div className="w3-row w3-section">
                            <label htmlFor="kyc_verified" className="w3-text-black w3-left"><b>KYC Verified</b></label>
                            <br />
                            <input
                                id="kyc_verified"
                                type="checkbox"
                                className="w3-check w3-margin-bottom"
                                checked={data.kyc_verified ?? false}
                                value={data.kyc_verified ? '1' : '0'}
                                onChange={(e) => setData('kyc_verified', e.target.checked)}
                            />
                            {errors.kyc_verified && <p className="w3-text-red">{errors.kyc_verified}</p>}
                        </div>
                        <div className="w3-row w3-section w3-center w3-padding-16 w3-margin-bottom w3-white w3-round-large" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                            <h3 className="w3-text-theme" style={{ fontWeight: 500 }}>Security Questions</h3>
                            <div style={{ minHeight: 120 }}>
                                <label htmlFor={`question_${questionIndex}`} className="w3-text-black w3-large w3-block w3-margin-bottom">
                                    {questionsList[questionIndex]}
                                </label>
                                <input
                                    id={`question_${questionIndex}`}
                                    type="text"
                                    className="w3-input w3-border w3-round w3-large"
                                    value={data.questions_answers[questionIndex] || ''}
                                    onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                                    placeholder="Your answer"
                                />
                                {errors[`questions_answers.${questionIndex}` as keyof typeof errors] && (
                                    <p className="w3-text-red">{errors[`questions_answers.${questionIndex}` as keyof typeof errors]}</p>
                                )}
                            </div>
                            <div className="w3-margin-top w3-margin-bottom">
                                <button
                                    type="button"
                                    className="w3-button w3-theme w3-round w3-margin-right"
                                    onClick={() => setQuestionIndex((prev) => Math.max(0, prev - 1))}
                                    disabled={questionIndex === 0}
                                >
                                    Previous
                                </button>
                                <span className="w3-text-grey w3-medium">
                                    Question {questionIndex + 1} of {totalQuestions}
                                </span>
                                <button
                                    type="button"
                                    className="w3-button w3-theme w3-round w3-margin-left"
                                    onClick={() => setQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                                    disabled={questionIndex === totalQuestions - 1}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="w3-light-grey w3-round-large" style={{ height: 8, width: '100%', margin: '8px 0' }}>
                                <div
                                    className="w3-theme w3-round-large"
                                    style={{ height: 8, width: `${((questionIndex + 1) / totalQuestions) * 100}%`, transition: 'width 0.3s' }}
                                ></div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w3-btn w3-theme w3-round w3-section w3-padding w3-right"
                            disabled={processing}
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
