import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import axios from 'axios';

import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { Button } from '@mui/material';

import 'app.css';

// プラグインを登録
dayjs.extend(utc);
dayjs.extend(timezone);
// ------------------------------------------------------------------------------------------

//「今日の日付」ページをリロードして一番初めに表示された時点
const initialValue = dayjs.utc(new Date().getTime()).tz('Asia/Tokyo');

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, LongPress, ...other } = props;
  const isLongPress = LongPress ? 'calenderDay_long-press' : ''; // loading状態を見てクラスを適用
  const isSelected = !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge key={props.day.toString()} overlap="circular" badgeContent={isSelected ? '💪' : undefined}>
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        className={isLongPress + (isSelected ? ' selected-day' : '')}
      />
    </Badge>
  );
}

const MuscleContinuouDays = ({ muscleCount }) => {
  // 無駄なリクエスト中断
  const requestAbortController = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  // 日付保存
  const [highlightedDays, setHighlightedDays] = useState([]);
  // カレンダー表示・非表示
  const [CalenderOpen, setCalenderOpen] = useState();
  const [MuscleCalender, setMuscleCalender] = useState({
    today: initialValue,
    LongPress: false //日付長押し状態
  });
  // 複数選択された日付の追跡
  const [MultipleSelection, setMultipleSelection] = useState([]);

  const timerRef = useRef(null);

  // 年・月・日付・が変更された時に動く
  const fetchHighlightedDays = async (dateValue) => {
    // 12から19日
    const date = dateValue.$y + '-' + (dateValue.$M + 1) + '-' + dateValue.$D;

    try {
      // Laravel側からデータを送信&受信
      const response = await axios.get('http://localhost:8000/get_WorkOutContinuousDays', {
        params: {
          date: date,
          user_id: 46497
        }
      });

      if (response.data !== 'Not a day') {
        // 日付だけ格納
        const formattedDays = response.data['workout_dates'].map((dateStr) => {
          return dayjs(dateStr).$D;
        });

        // 筋トレした日💪表示
        setHighlightedDays(formattedDays);
        // 親：AnalyticEcommerceに値を渡す。
        muscleCount(response.data['total_count']);
      }

      setIsLoading(false);
    } catch (error) {
      return console.log('error', error);
    }
  };

  // 登録ボタン
  const RegistrationMuscleDay = async () => {
    let clickDay = [];
    // フォーマットを0000-00-00に変更
    let date = [];
    // 選択された日付を代入
    if (MuscleCalender.LongPress === true) {
      // 複数選択状態だった場合
      clickDay = MultipleSelection;
      clickDay.forEach((day) => {
        let formattedDate = day.$y + '-' + (day.$M + 1).toString().padStart(2, '0') + '-' + day.$D.toString().padStart(2, '0');
        // `data`配列に追加
        date.push(formattedDate);
      });
      console.log('clickDay:複数選択', clickDay);
      console.log('clickDay:date:複数選択', date);
    } else {
      // 単体選択状態だった場合
      clickDay = MuscleCalender.today;
      date = clickDay.$y + '-' + (clickDay.$M + 1).toString().padStart(2, '0') + '-' + clickDay.$D.toString().padStart(2, '0');
      console.log('clickDay:単体選択', clickDay);
      console.log('clickDay:date:複数選択', date);
    }

    console.log('date', date);
    try {
      // Laravel側からデータを送信&受信
      const response = await axios.get('http://localhost:8000/WorkOutContinuousDays', {
        params: { date: date }
      });

      if (response) {
        // 💪を表示するためにカレンダーを再レンダリング
        fetchHighlightedDays(initialValue);
      }
    } catch (err) {
      console.log('err:', err);
    }
  };

  // 長押し開始
  const handleMouseDown = (/*item*/) => {
    timerRef.current = setTimeout(() => {
      setMuscleCalender((prev) => ({
        ...prev,
        LongPress: true
      }));
    }, 800);
  };

  // 現在の年月日のカレンダーを表示する。
  useEffect(() => {
    console.log('initialValue', initialValue);
    fetchHighlightedDays(initialValue);
    return () => requestAbortController.current?.abort();
  }, []);

  useEffect(() => {
    if (MuscleCalender.LongPress === true) {
      console.log('長押しが最終的に通りました。');
      // 長押しが最終的に通ったら 日付をクリックして
      // 選択された日付を表示。

      setMultipleSelection((prev) => {
        // 配列内に重複データがないか確認し、なければそのまま値を代入、あればパスする処理
        // なぜ以下の処理をするのか？➡︎複数選択の際に同じ日付を何度も保存してしまうため。
        const isAlreadySelected = prev.some(
          (item) => item.$d.getTime() === MuscleCalender.today.$d.getTime(),
          console.log('MuscleCalender.today.$d.getTime()', MuscleCalender.today.$d.getTime())
        );

        // 重複データがあった場合は何も追加せずに終了させる
        if (isAlreadySelected) {
          return prev;
        }

        return [...prev, MuscleCalender.today];
      });
      // console.log('MuscleCalender.today', MuscleCalender.today);

      // ServerDay({
      //   clickDay:
      // })
    } else {
      console.log('長押しが最終的に通っていない。');
      setHighlightedDays([]);
      fetchHighlightedDays(MuscleCalender.today);
    }
  }, [MuscleCalender]);

  useEffect(() => {
    console.log('MultipleSelection', MultipleSelection);
  }, [MultipleSelection]);

  return (
    <>
      <Button onClick={() => setCalenderOpen((prev) => !prev)}>入力</Button>

      {MuscleCalender.LongPress == true && (
        <>
          <Button>削除</Button>
          <Button onClick={() => setMuscleCalender((prev) => ({ ...prev, LongPress: false }))}>閉じる</Button>
        </>
      )}
      {CalenderOpen && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            defaultValue={initialValue}
            loading={isLoading}
            onMonthChange={(e) =>
              setMuscleCalender((prev) => ({
                ...prev,
                today: e
              }))
            }
            // 日付がクリックされたら
            onChange={(e) =>
              setMuscleCalender((prev) => ({
                ...prev,
                today: e
              }))
            }
            onMouseDown={(e) => handleMouseDown(e)}
            renderLoading={() => <DayCalendarSkeleton />}
            slots={{
              day: ServerDay
            }}
            slotProps={{
              day: {
                highlightedDays,
                LongPress: MuscleCalender.LongPress
              }
            }}
          />
          <Button onClick={RegistrationMuscleDay}>登録</Button>
        </LocalizationProvider>
      )}
    </>
  );
};

export default MuscleContinuouDays;
