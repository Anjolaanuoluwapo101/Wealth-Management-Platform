<?php

namespace App\Http\Controllers\Settings;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // Log raw request data
        \Log::info('Raw Request Data:', $request->all());
        \Log::info('Files:', $request->allFiles());

        // Stop execution to inspect the request
        // dd($request->all(), $request->allFiles());

        $user = $request->user();

        // Log all incoming request data
        \Log::info('Request Data:', $request->all());

        // Check if files are present
        $fileFields = ['address_proof', 'bank_proof', 'self_photograph'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);

                // Log file details
                \Log::info("File for {$field} received:", [
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ]);
            } else {
                \Log::warning("No file found for field: {$field}");
            }
        }

        // Stop execution to inspect the request
        // dd($request->all());

        // Ensure name and email are included in the validated data
        $validated = $request->validated();
        $validated['name'] = $request->input('name', $user->name);
        $validated['email'] = $request->input('email', $user->email);

        // Validate and handle file uploads
        try {
            foreach ($fileFields as $field) {
                if ($request->hasFile($field)) {
                    // Delete the old file if it exists
                    if ($user->{$field}) {
                        Storage::disk('public')->delete($user->{$field});
                    }

                    // Store the new file using the Storage facade
                    $file = $request->file($field);
                    $validated[$field] = $file->store('profile', 'public');
                } else {
                    echo "File not found for field: $field";
                }
            }
        } catch (\Exception $e) {
            echo $e->getMessage();
        }

        // Validate PAN card and KYC fields
        if ($request->has('pan_card')) {
            $validated['pan_card'] = $request->input('pan_card');
        }

        // Ensure kyc_verified is cast to a boolean
        $validated['kyc_verified'] = filter_var($request->input('kyc_verified'), FILTER_VALIDATE_BOOLEAN);

        // Save questions_answers as JSON
        if ($request->has('questions_answers')) {
            $validated['questions_answers'] = json_encode($request->input('questions_answers'));
        }
 
        // Update user fields
        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
