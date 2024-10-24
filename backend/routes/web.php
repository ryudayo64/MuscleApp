<?php

use App\Http\Controllers\get_WorkOutContinuousDays;
use App\Http\Controllers\WorkOutContinuousDays;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// 筋トレ日数登録   URL ➡︎ クラス名　➡︎ 関数名
Route::get('/WorkOutContinuousDays', [WorkOutContinuousDays::class, 'WorkOutContinuousDays']);

// 筋トレ年月日取得
Route::get('/get_WorkOutContinuousDays', [get_WorkOutContinuousDays::class, 'get_WorkOutContinuousDays']);


// Cors
Route::group(['middleware' => ['api', 'cors']], function () {
    Route::options('articles', function () {
        return response()->json();
    });
    Route::resource('articles', 'Api\ArticlesController');
});