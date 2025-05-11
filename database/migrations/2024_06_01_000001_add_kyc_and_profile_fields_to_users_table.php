<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddKycAndProfileFieldsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('pan_card')->nullable()->after('dob');
            $table->string('address_proof')->nullable()->after('pan_card');
            $table->string('bank_proof')->nullable()->after('address_proof');
            $table->string('self_photograph')->nullable()->after('bank_proof');
            $table->boolean('kyc_verified')->default(false)->after('self_photograph');
            $table->unsignedInteger('questions_answered_count')->default(0)->after('kyc_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'pan_card',
                'address_proof',
                'bank_proof',
                'self_photograph',
                'kyc_verified',
                'questions_answered_count',
            ]);
        });
    }
}
