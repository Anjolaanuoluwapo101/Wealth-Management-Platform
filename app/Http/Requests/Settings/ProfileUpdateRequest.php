<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    // public function rules(): array
    // {
    //     return [
    //         'name' => ['required', 'string', 'max:255'],

    //         'email' => [
    //             'required',
    //             'string',
    //             'lowercase',
    //             'email',
    //             'max:255',
    //             Rule::unique(User::class)->ignore($this->user()->id),
    //         ],
    //     ];
    // }

    public function rules(): array
    {
        return [
            'name' => [ 'string', 'max:255'],
            'email' => [ 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id),],
            'pan_card' => ['nullable', 'integer', 'max:99999999999'],
            'address_proof' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:2048'], // 2MB max
            'bank_proof' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:2048'],
            'self_photograph' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:2048'],
            'kyc_verified' => ['string'],
            'questions_answered_count' => [ 'integer', 'min:0', 'max:10'],
            'questions_answers' => ['nullable', 'array'],
            'questions_answers.*' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
