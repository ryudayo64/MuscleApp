<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // ユーザー名
            $table->string('email')->unique(); // メールアドレス
            $table->timestamp('email_verified_at')->nullable(); // メール確認
            $table->string('password'); // パスワード
            $table->string('profile_image')->nullable(); // プロフィール画像
            $table->float('height')->nullable(); // 身長
            $table->float('weight')->nullable(); // 体重
            $table->integer('age')->nullable(); // 年齢
            $table->rememberToken(); // ログイン保持
            $table->timestamps(); // 作成・更新時刻
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
