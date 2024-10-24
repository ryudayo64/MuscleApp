<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\s_work_out_registration;
use Carbon\Carbon;

class get_WorkOutContinuousDays extends Controller
{
    public function get_WorkOutContinuousDays(Request $request)
    {
        // リクエストからパラメータを取得
        $CalenderDate = $request->input('date');
        $userId = $request->input('user_id');  // ユーザーIDもリクエストから受け取る

        try {
            // \Log::info('get_WorkOutContinuousDays:CalenderDate:');
            // \Log::info($CalenderDate);
            // \Log::info('get_WorkOutContinuousDays:userId:');
            // \Log::info($userId);
            $date = Carbon::parse($CalenderDate);
            $year = $date->year;
            $month = $date->month;
            \Log::info('get_WorkOutContinuousDays:date:');
            \Log::info($date);
            \Log::info('get_WorkOutContinuousDays:year:');
            \Log::info($year);
            \Log::info('get_WorkOutContinuousDays:month:');
            \Log::info($month);


            // 指定した user_id と workout_date に一致するレコードを取得する
            $workoutRegistration = s_work_out_registration::where('user_id', $userId)
                ->whereYear('workout_date', $year)
                ->whereMonth('workout_date', $month)
                ->get();
            \Log::info('get_WorkOutContinuousDays:month:');
            \Log::info($month);

            $workoutDates = $workoutRegistration->pluck('workout_date')->toArray();

            $response = [
                'workout_dates' => $workoutDates, //各月の筋トレ行った日
                'total_count' => $workoutRegistration->count() //筋トレ継続した日数
            ];



            // レコードが存在する場合
            if ($workoutRegistration->isNotEmpty()) {
                return response()->json($response);
            } else {
                // レコードが見つからない場合
                return response()->json("Not a day");
            }

        } catch (\Exception $e) {
            \Log::error('get_WorkOutContinuousDays: エラー');
            \Log::error($e);

            // エラーを返す
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
