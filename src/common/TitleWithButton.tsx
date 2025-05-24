import React from 'react';
import { Box, Typography, Button, ButtonProps } from '@mui/material';

type TitleWithButtonProps = {
  title: string;
  buttonText: string;
  onClick?: () => void;
  containerSx?: object;
  titleSx?: object;
  buttonProps?: ButtonProps;
};

const TitleWithButton: React.FC<TitleWithButtonProps> = ({
  title,
  buttonText,
  onClick,
  containerSx = {},
  titleSx = {},
  buttonProps = {},
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ width: '100%', ...containerSx }}
    >
      <Typography variant="h4" sx={titleSx}>
        {title}
      </Typography>
      <Button variant="contained" onClick={onClick} {...buttonProps}>
        {buttonText}
      </Button>
    </Box>
  );
};

export default TitleWithButton;
