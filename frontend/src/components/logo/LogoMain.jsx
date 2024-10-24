// material-ui
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Logo = () => {
  const theme = useTheme();

  return (
    <>
      <Typography variant="h4" color="inherit">
        StoryOfMyLife
      </Typography>
    </>
  );
};

export default Logo;
