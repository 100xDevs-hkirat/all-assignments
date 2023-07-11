import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from '@mui/material';

export default function Course({
  title,
  description,
  price,
  imageLink,
  onClick,
  buttonMessage,
}) {
  return (
    <Card>
      <CardMedia
        sx={{ height: 140, width: 140, margin: 'auto' }}
        image={imageLink}
        title="course image"
      />
      <CardHeader
        title={title}
        subheader={description}
        titleTypographyProps={{ align: 'center' }}
        subheaderTypographyProps={{
          align: 'justify',
          whiteSpace: 'pre-line',
        }}
      />
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary">
          {`Rs. ${price}`}
        </Typography>
      </CardContent>
      {onClick && (
        <CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            variant="contained"
            align="center">
            {buttonMessage}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
