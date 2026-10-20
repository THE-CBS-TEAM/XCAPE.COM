import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import {
  CssBaseline,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material'
import {
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { store } from '@store/store'
import { lightTheme, darkTheme } from '@styles/theme'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { toggleTheme } from '@store/slices/themeSlice'

// Import pages
import HomePage from '@pages/HomePage'
import ConceptsPage from '@pages/ConceptsPage'
import UserGuidePage from '@pages/UserGuidePage'
import SimulatorPage from '@pages/SimulatorPage'
import AboutPage from '@pages/AboutPage'
import ProfilesPage from '@pages/ProfilesPage'
import DeveloperProfilePage from '@pages/DeveloperProfilePage'
import ContactPage from '@pages/ContactPage'
import LoginPage from '@pages/LoginPage'
import RegisterPage from '@pages/RegisterPage'
import JoinWorkspacePage from '@pages/JoinWorkspacePage'
import UserDashboard from '@pages/UserDashboard'
import SensitivityPage from '@pages/SensitivityPage'

// Auth
import { AuthProvider, useAuth } from '@context/AuthContext'
import ProtectedRoute from '@components/ProtectedRoute'

const Navigation: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const themeMode = useAppSelector((state) => state.theme.mode)
  const { isAuthenticated, user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Concepts', path: '/concepts' },
    { label: 'User Guide', path: '/guide' },
    { label: 'About', path: '/about' },
    { label: 'Developer', path: '/developer' },
    { label: 'Contact', path: '/contact' },
  ]

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout()
    handleMenuClose()
    navigate('/')
  }

  const isDark = themeMode === 'dark'

  return (
    <Box
      sx={{
        bgcolor: isDark ? '#0B0F19' : 'primary.main',
        color: 'white',
        px: { xs: 2, md: 4 },
        py: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
        boxShadow: isDark ? '0 4px 20px -2px rgba(0, 0, 0, 0.5)' : 2,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      <Box
        onClick={() => navigate('/')}
        sx={{
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '1.3rem',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          letterSpacing: '-0.02em',
        }}
      >
        <Box
          component="img"
          src="/xcapeblackBG.png"
          alt="XCAPE"
          sx={{
            height: 32,
            filter: isDark ? 'brightness(200%) drop-shadow(0 0 8px rgba(56, 189, 248, 0.3))' : 'brightness(180%)',
          }}
        />
        <Box component="span" sx={{ color: isDark ? '#F8FAFC' : 'white' }}>
          XCAPE
        </Box>
      </Box>

      {/* Desktop Navigation */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
        {navLinks.map((link) => (
          <Button
            key={link.path}
            color="inherit"
            onClick={() => navigate(link.path)}
            sx={{
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.95rem',
              color: isDark ? '#94A3B8' : 'white',
              px: 1.5,
              py: 0.75,
              borderRadius: '8px',
              '&:hover': {
                color: isDark ? '#38BDF8' : 'white',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {link.label}
          </Button>
        ))}
        {isAuthenticated && (
          <Button
            onClick={() => navigate('/simulator')}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              ml: 1,
              px: 2,
              py: 0.75,
              borderRadius: '8px',
              background: isDark
                ? 'rgba(56, 189, 248, 0.12)'
                : 'rgba(255, 255, 255, 0.2)',
              color: isDark ? '#38BDF8' : 'white',
              border: isDark ? '1px solid rgba(56, 189, 248, 0.3)' : 'none',
              '&:hover': {
                background: isDark
                  ? 'rgba(56, 189, 248, 0.2)'
                  : 'rgba(255, 255, 255, 0.3)',
                boxShadow: isDark ? '0 0 12px rgba(56, 189, 248, 0.25)' : 'none',
              },
            }}
          >
            Simulator
          </Button>
        )}
      </Box>

      {/* Right side - Auth & Theme */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {isAuthenticated ? (
          <>
            <Button
              color="inherit"
              onClick={() => navigate('/dashboard')}
              sx={{
                fontWeight: 500,
                textTransform: 'none',
                color: isDark ? '#94A3B8' : 'white',
                display: { xs: 'none', md: 'block' },
                '&:hover': { color: isDark ? '#38BDF8' : 'white' },
              }}
            >
              Dashboard
            </Button>
            <Avatar
              onClick={handleMenuOpen}
              sx={{
                cursor: 'pointer',
                background: isDark ? '#1E293B' : 'rgba(255, 255, 255, 0.3)',
                color: isDark ? '#38BDF8' : 'white',
                border: isDark ? '1px solid rgba(56, 189, 248, 0.3)' : 'none',
                width: 36,
                height: 36,
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              {user?.first_name.charAt(0)}{user?.last_name.charAt(0)}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 160,
                  bgcolor: isDark ? '#111827' : 'background.paper',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                  boxShadow: isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.7)' : 3,
                },
              }}
            >
              <MenuItem disabled sx={{ color: isDark ? '#64748B' : 'text.secondary', fontSize: '0.85rem' }}>
                {user?.first_name} {user?.last_name}
              </MenuItem>
              <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose() }}>
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => { navigate('/simulator'); handleMenuClose() }}>
                Simulator
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: '#EF4444' }}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{
                fontWeight: 500,
                textTransform: 'none',
                color: isDark ? '#94A3B8' : 'white',
                display: { xs: 'none', sm: 'block' },
                '&:hover': { color: isDark ? '#38BDF8' : 'white' },
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: isDark ? '#38BDF8' : 'white',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.4)' : 'white',
                textTransform: 'none',
                fontWeight: 500,
                display: { xs: 'none', sm: 'block' },
                borderRadius: '8px',
                '&:hover': {
                  borderColor: isDark ? '#38BDF8' : 'white',
                  backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={() => navigate('/register')}
            >
              Sign Up
            </Button>
          </>
        )}

        {/* Theme Toggle */}
        <IconButton
          color="inherit"
          onClick={() => dispatch(toggleTheme())}
          title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
          sx={{
            color: isDark ? '#FBBF24' : 'white',
            p: 1,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {themeMode === 'light' ? <DarkIcon /> : <LightIcon />}
        </IconButton>

        {/* Mobile Hamburger Button */}
        <IconButton
          color="inherit"
          onClick={() => setMobileOpen(true)}
          sx={{
            display: { xs: 'flex', md: 'none' },
            color: isDark ? '#F8FAFC' : 'white',
            p: 1,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            },
          }}
          aria-label="open navigation menu"
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 290,
            bgcolor: isDark ? '#0A0F1D' : '#FFFFFF',
            color: isDark ? '#F8FAFC' : '#0F172A',
            borderLeft: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src="/xcapeblackBG.png"
              alt="XCAPE"
              sx={{
                height: 28,
                filter: isDark ? 'brightness(200%) drop-shadow(0 0 8px rgba(56, 189, 248, 0.3))' : 'brightness(180%)',
              }}
            />
            <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: isDark ? '#F8FAFC' : '#0F4C81' }}>
              XCAPE
            </Typography>
          </Box>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: isDark ? '#94A3B8' : '#64748B' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0', mb: 2 }} />

        <List sx={{ p: 0, flex: 1 }}>
          {navLinks.map((link) => (
            <ListItem key={link.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(link.path)
                  setMobileOpen(false)
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(56,189,248,0.1)' : 'rgba(15,76,129,0.06)',
                    color: isDark ? '#38BDF8' : '#0F4C81',
                  },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.98rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          {isAuthenticated ? (
            <>
              <ListItem disablePadding sx={{ mt: 1, mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    navigate('/simulator')
                    setMobileOpen(false)
                  }}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 2,
                    bgcolor: isDark ? 'rgba(244,180,0,0.15)' : 'rgba(244,180,0,0.12)',
                    color: isDark ? '#F4B400' : '#B45309',
                    border: '1px solid rgba(244,180,0,0.3)',
                  }}
                >
                  <ListItemText
                    primary="Simulator"
                    primaryTypographyProps={{ fontWeight: 700, fontSize: '0.98rem' }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    navigate('/dashboard')
                    setMobileOpen(false)
                  }}
                  sx={{ borderRadius: 2, py: 1.2, px: 2 }}
                >
                  <ListItemText
                    primary="Dashboard"
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.98rem' }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  navigate('/login')
                  setMobileOpen(false)
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#CBD5E1',
                  color: isDark ? '#F8FAFC' : '#0F172A',
                }}
              >
                Log In
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  navigate('/register')
                  setMobileOpen(false)
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  bgcolor: isDark ? '#38BDF8' : '#0F4C81',
                  color: '#FFFFFF',
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </List>

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0', my: 2 }} />

        {/* Theme and Logout at bottom of drawer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 0.5 }}>
          <Typography variant="body2" sx={{ color: isDark ? '#94A3B8' : '#64748B', fontWeight: 500 }}>
            {themeMode === 'light' ? 'Light Mode' : 'Dark Mode'}
          </Typography>
          <IconButton
            onClick={() => dispatch(toggleTheme())}
            sx={{
              color: isDark ? '#FBBF24' : '#0F4C81',
              bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            }}
          >
            {themeMode === 'light' ? <DarkIcon /> : <LightIcon />}
          </IconButton>
        </Box>
        {isAuthenticated && (
          <Button
            fullWidth
            onClick={() => {
              handleLogout()
              setMobileOpen(false)
            }}
            sx={{
              mt: 2,
              color: '#EF4444',
              textTransform: 'none',
              fontWeight: 600,
              justifyContent: 'flex-start',
            }}
          >
            Log Out
          </Button>
        )}
      </Drawer>
    </Box>
  )
}

const AppContent: React.FC = () => {
  const themeMode = useAppSelector((state) => state.theme.mode)
  const theme = themeMode === 'light' ? lightTheme : darkTheme

  React.useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [themeMode])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Navigation />
        <Box component="main" sx={{ flex: 1, py: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/concepts" element={<ConceptsPage />} />
            <Route path="/guide" element={<UserGuidePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/developer" element={<DeveloperProfilePage />} />
            <Route path="/profile" element={<DeveloperProfilePage />} />
            <Route path="/profiles/:section" element={<ProfilesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/join" element={<JoinWorkspacePage />} />
            
            {/* Protected Routes */}
            <Route
              path="/simulator"
              element={
                <ProtectedRoute>
                  <SimulatorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sensitivity"
              element={
                <ProtectedRoute>
                  <SensitivityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </Provider>
  )
}

export default App
