import { Card, Typography,Link } from '@mui/material'

const Footer = () => {
  return (
    <div>
      <Card
        style={{
          backgroundImage: 'linear-gradient(to bottom right, gray, white)',
          marginInline: 40,
          marginTop: 40,
          padding: 30,
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Typography variant="h5">CoursePro</Typography>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <Typography variant="h6">Quick Links</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column',marginBlock:5 }}>
            <Link>Terms & Conditions</Link>
            <Link>Privacy Policy</Link>
            <Link>Refunds & Cancellation Policy</Link>
          </div>
        </div>
        <div>
          <Typography variant="h6">Follow us</Typography>
        </div>
      </Card>
    </div>
  )
}

export default Footer
