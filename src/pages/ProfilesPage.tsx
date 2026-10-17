import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Card, CardContent, Grid, Avatar, Chip, Divider, useTheme, Button } from '@mui/material'
import {
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Person as PersonIcon,
} from '@mui/icons-material'

interface Profile {
  id: string
  name: string
  role: string
  image: string
  qualification: string
  bio: string
  achievement: string
  contact: string
  address: string
  department?: string
}

const teamMembers: Profile[] = [
  {
    id: '1',
    name: 'Osimi Godsgift Gbubemi',
    role: 'Creator & Lead Developer',
    image: '/osimi_profile.jpg',
    qualification: 'B.Eng (Petroleum Engineering) · Computational Reservoir Modeler',
    bio: 'Petroleum engineer and computational researcher specializing in automated history matching (EnKF), forward flow simulations (OPM Flow), and nodal multiphase hydraulics (Beggs & Brill).',
    achievement: 'Authored XCAPE platform, published gas lift optimization research in IJAAR (June 2026), and implemented full EnKF data assimilation with Beggs & Brill hydraulics.',
    contact: '07049946769 · osimigbubemigodsgift@gmail.com',
    address: 'Federal University of Technology, Owerri (FUTO), Nigeria',
    department: 'Department of Petroleum Engineering',
  },
]

const contributors: Profile[] = [
  {
    id: '2',
    name: 'Dr Anthony O. Chikwe',
    role: 'Project Supervisor & Mentor',
    image: 'AC',
    qualification: 'PhD in Petroleum Engineering',
    bio: 'Distinguished petroleum engineering scholar with focus on reservoir simulation, multiphase flow, production optimization, and advanced analytics.',
    achievement: 'Supervised development of XCAPE, published numerous high-impact papers in reservoir engineering, and championed computational education in Nigeria.',
    contact: 'anthony.chikwe@futo.edu.ng',
    address: 'Federal University of Technology, Owerri (FUTO), Nigeria',
    department: 'Department of Petroleum Engineering',
  },
]

const ProfilesPage: React.FC = () => {
  const { section } = useParams<{ section: string }>()
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const primaryColor = isDark ? '#38BDF8' : '#0F4C81'
  const isTeam = section === 'team'
  const profiles = isTeam ? teamMembers : contributors

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            textAlign: 'center',
            fontWeight: 800,
            color: isDark ? '#F8FAFC' : '#0F172A',
            letterSpacing: '-0.02em',
          }}
        >
          {isTeam ? 'Development Team & Leadership' : 'Contributors & Academic Supervisors'}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: isDark ? '#94A3B8' : '#64748B',
            mb: 6,
            fontSize: '1.1rem',
          }}
        >
          Meet the innovators and scholars driving the XCAPE computational platform
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {profiles.map((profile) => (
            <Grid item xs={12} sm={8} md={6} lg={5} key={profile.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3.5,
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                  backgroundColor: isDark ? '#0C1322' : '#FFFFFF',
                  boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.5)' : '0 8px 24px rgba(15,76,129,0.08)',
                }}
              >
                <CardContent sx={{ flex: 1, p: 3.5 }}>
                  {/* Avatar / Photo */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar
                      src={profile.image.startsWith('/') ? profile.image : undefined}
                      sx={{
                        width: 140,
                        height: 140,
                        mx: 'auto',
                        fontSize: '3rem',
                        backgroundColor: primaryColor,
                        color: isDark ? '#090D16' : 'white',
                        fontWeight: 700,
                        mb: 2,
                        border: '3px solid #F4B400',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      }}
                    >
                      {!profile.image.startsWith('/') && profile.image}
                    </Avatar>
                  </Box>

                  {/* Name & Role */}
                  <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', mb: 1 }}>
                    {profile.name}
                  </Typography>
                  <Chip
                    icon={<WorkIcon />}
                    label={profile.role}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ display: 'block', mx: 'auto', mb: 3 }}
                  />

                  <Divider sx={{ my: 2 }} />

                  {/* Qualification */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: primaryColor, mb: 0.5 }}
                    >
                      <SchoolIcon sx={{ fontSize: '1rem', mr: 0.5, mb: '-2px' }} />
                      Qualification
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {profile.qualification}
                    </Typography>
                  </Box>

                  {/* Bio */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: primaryColor, mb: 0.5 }}>
                      Bio
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.5 }}>
                      {profile.bio}
                    </Typography>
                  </Box>

                  {/* Achievement */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: primaryColor, mb: 0.5 }}>
                      <StarIcon sx={{ fontSize: '1rem', mr: 0.5, mb: '-2px' }} />
                      Key Achievement
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.5 }}>
                      {profile.achievement}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Contact & Location */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ fontSize: '1rem', color: primaryColor }} />
                      <span style={{ wordBreak: 'break-all' }}>{profile.contact}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon sx={{ fontSize: '1rem', color: primaryColor }} />
                      {profile.address}
                    </Typography>
                    {profile.department && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WorkIcon sx={{ fontSize: '1rem', color: primaryColor }} />
                        {profile.department}
                      </Typography>
                    )}
                  </Box>

                  {profile.id === '1' && (
                    <Box sx={{ mt: 3, pt: 2, borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0' }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PersonIcon />}
                        onClick={() => navigate('/developer')}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${primaryColor}, #1F7A8C)`,
                          color: '#FFFFFF',
                          py: 1,
                        }}
                      >
                        View Full Executive Profile & Publications
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}

export default ProfilesPage
