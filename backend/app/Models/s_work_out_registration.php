<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class s_work_out_registration extends Model
{
    use HasFactory;

    // テーブル名を指定（省略可能、Laravelはモデル名を複数形にして自動推測する）
    protected $table = 's_work_out_registration';

    // マスアサインメント可能な属性
    protected $fillable = [
        'id',
        'user_id',
        'workout_date',
        'created_at',
        'updated_at',
    ];
}
