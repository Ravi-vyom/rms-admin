"use client"
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';

const cards = [
  {
    id: 1,
    title: 'Plants',
    description: 'Plants are essential for all life.',
  },
  {
    id: 2,
    title: 'Animals',
    description: 'Animals are a part of nature.',
  },
  {
    id: 3,
    title: 'Humans',
    description: 'Humans depend on plants and animals for survival.',
  },
  {
    id: 4,
    title: "Ha",
    description: 'Humans depend on plants and animals for survival.',

  }
];

export default function Dashboard() {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
        gap: 2,
      }}
    >
      {cards.map((card, index) => (
        <Paper sx={{
          mb: 2
        }} key={index} elevation={5}>

          <CardContent sx={{ height: '100%' }}>
            <Typography variant="h5" component="div">
              {card.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {card.description}
            </Typography>
          </CardContent>

        </Paper>
      ))}
    </Box>
  );
}

