import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
// import Chip from '@mui/material/Chip';
// import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';

// assets
// import RiseOutlined from '@ant-design/icons/RiseOutlined';
// import FallOutlined from '@ant-design/icons/FallOutlined';

import MuscleContinuouDays from './MuscleContinuouDays';
import RMCounter from './RMCounter';

// const iconSX = { fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 };

export default function AnalyticEcommerce({ /*color = 'primary', */ title /*count, percentage, isLoss, extra */ }) {
  const [MuscleCountValue, setMuscleCountValue] = useState('');

  // 子コンポーネントから筋トレ継続日数を届けてもらう。
  const muscleCount = (newValue) => {
    setMuscleCountValue(newValue);
  };

  const Items = {
    筋トレ: {
      MuscleCalender: <MuscleContinuouDays muscleCount={muscleCount} />,
      MuscleCount: MuscleCountValue
    },
    RM計算機: {
      RMcounter: <RMCounter />
    },
    偉人の名言: {
      RMcounter: <RMCounter />
    }
  };

  let Contents = '';

  switch (title) {
    case '筋トレ':
      Contents = (
        <div style={{ display: 'flex' }}>
          <div>
            <Typography variant="h4" color="inherit">
              {Items[title].MuscleCount} 日
            </Typography>
          </div>
          <div>{Items[title].MuscleCalender}</div>
        </div>
      );
      break;
    case 'RM計算機':
      Contents = (
        <div>
          <div>{Items[title].RMcounter}</div>
        </div>
      );
      break;
    case '偉人の名言':
      Contents = (
        <div>
          <div>{Items[title].RMcounter}</div>
        </div>
      );
      break;

    default:
      break;
  }

  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
      </Stack>
      <Box sx={{ pt: 2.25 }}>{Contents && Contents}</Box>
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.string
};
