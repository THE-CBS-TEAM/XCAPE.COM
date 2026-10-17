import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  InputAdornment,
  CircularProgress,
  useTheme,
} from '@mui/material'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Send as SendIcon,
} from '@mui/icons-material'

const ContactPage: React.FC = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const primaryColor = isDark ? '#38BDF8' : '#0F4C81'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }, 1500)
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            textAlign: 'center',
            fontWeight: 700,
            color: primaryColor,
          }}
        >
          Contact Us
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'textSecondary',
            mb: 6,
            fontSize: '1.1rem',
          }}
        >
          Have questions? We'd love to hear from you. Get in touch with us!
        </Typography>

        {/* Contact Image */}
        <Box
          component="img"
          src="/image4.png"
          alt="Contact Us"
          sx={{
            maxWidth: '100%',
            height: 'auto',
            maxHeight: 250,
            mb: 6,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(15, 76, 129, 0.15)',
            display: 'block',
            mx: 'auto',
          }}
        />

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: primaryColor }}>
              Get in Touch
            </Typography>

            {/* Email Card */}
            <Card sx={{ mb: 3, position: 'relative', overflow: 'hidden' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: isDark
                    ? 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)'
                    : 'linear-gradient(135deg, #0F4C81 0%, #1F7A8C 100%)',
                }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <EmailIcon sx={{ color: primaryColor, fontSize: '1.8rem' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Email
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      contact@xcape-simulator.com
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Phone Card */}
            <Card sx={{ mb: 3, position: 'relative', overflow: 'hidden' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #1F7A8C 0%, #F4B400 100%)',
                }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <PhoneIcon sx={{ color: '#1F7A8C', fontSize: '1.8rem' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Phone
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      +234 (0) XXX XXX XXXX
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card sx={{ mb: 3, position: 'relative', overflow: 'hidden' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #F4B400 0%, #22C55E 100%)',
                }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <LocationIcon sx={{ color: '#F4B400', fontSize: '1.8rem' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Location
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Nigeria
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Department Card */}
            <Card sx={{ position: 'relative', overflow: 'hidden' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #22C55E 0%, #0F4C81 100%)',
                }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <SchoolIcon sx={{ color: '#22C55E', fontSize: '1.8rem' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Department
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Petroleum Engineering
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: primaryColor }}>
                  Send us a Message
                </Typography>

                {submitStatus === 'success' && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Thank you for your message! We'll get back to you soon.
                  </Alert>
                )}

                {submitStatus === 'error' && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    There was an error submitting your form. Please try again.
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ color: primaryColor }}>👤</Box>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: primaryColor }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Question about simulator"
                    required
                  />

                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    multiline
                    rows={5}
                    required
                  />

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                      sx={{
                        backgroundColor: primaryColor,
                        color: isDark ? '#090D16' : 'white',
                        '&:hover': {
                          backgroundColor: isDark ? '#7DD3FC' : '#0a3857',
                        },
                        fontWeight: 700,
                      }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                    <Button
                      type="reset"
                      variant="outlined"
                      size="large"
                      sx={{
                        color: primaryColor,
                        borderColor: isDark ? 'rgba(56, 189, 248, 0.4)' : '#0F4C81',
                        fontWeight: 700,
                        '&:hover': {
                          borderColor: primaryColor,
                        },
                      }}
                    >
                      Clear
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Response Time Notice */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Card sx={{ backgroundColor: 'rgba(15, 76, 129, 0.05)' }}>
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                We typically respond to inquiries within <strong>24-48 hours</strong>. Thank you for taking the time to
                contact us!
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}

export default ContactPage
