<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('s_work_out_registration', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // usersテーブルとのリレーション
            $table->date('workout_date'); // 筋トレ日付
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('s_work_out_registration');
    }
};