<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablesForDashboard extends Migration
{
    public function up(): void
    {
        Schema::create('mutual_funds', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('name');
            $table->string('type');
            $table->decimal('value', 15, 2);
            $table->integer('transactions');
            $table->timestamps();
        });

        Schema::create('other_assets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('type');
            $table->decimal('value', 15, 2);
            $table->timestamps();
        });

        Schema::create('fixed_incomes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('type');
            $table->decimal('value', 15, 2);
            $table->timestamps();
        });

        Schema::create('insurances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('type');
            $table->string('policy_number');
            $table->date('expiry_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mutual_funds');
        Schema::dropIfExists('other_assets');
        Schema::dropIfExists('fixed_incomes');
        Schema::dropIfExists('insurances');
    }
}