import { createTheme, ThemeProvider } from '@mui/material/styles'

const colors = {
  primary: '#0F4C81',
  secondary: '#1F7A8C',
  accent: '#F4B400',
  background: '#F7F9FC',
  cardSurface: '#FFFFFF',
  text: '#1F2937',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary,
      light: '#1F7A8C',
      dark: '#0A3358',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.secondary,
      light: '#38BDF8',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    divider: '#E2E8F0',
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.error,
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontSize: '2.5rem', fontWeight: 700, color: '#0F172A' },
    h2: { fontSize: '2rem', fontWeight: 700, color: '#0F172A' },
    h3: { fontSize: '1.5rem', fontWeight: 600, color: '#0F172A' },
    h4: { fontSize: '1.25rem', fontWeight: 600, color: '#0F172A' },
    h5: { fontSize: '1rem', fontWeight: 600, color: '#0F172A' },
    h6: { fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' },
    body1: { fontSize: '1rem', lineHeight: 1.6, color: '#1E293B' },
    body2: { fontSize: '0.875rem', color: '#475569' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
          border: '1px solid #E2E8F0',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#38BDF8', // Modern electric cyan-sky accent
      light: '#7DD3FC',
      dark: '#0284C7',
      contrastText: '#090D16',
    },
    secondary: {
      main: '#2DD4BF', // Electric teal accent
      light: '#5EEAD4',
      dark: '#0D9488',
      contrastText: '#090D16',
    },
    background: {
      default: '#090D16', // Deep obsidian canvas
      paper: '#111827',   // Precision slate card surface
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    action: {
      hover: 'rgba(255, 255, 255, 0.05)',
      selected: 'rgba(56, 189, 248, 0.12)',
    },
    success: {
      main: '#34D399',
      light: '#6EE7B7',
      dark: '#059669',
    },
    warning: {
      main: '#FBBF24',
      light: '#FDE68A',
      dark: '#D97706',
    },
    error: {
      main: '#F87171',
      light: '#FCA5A5',
      dark: '#DC2626',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontSize: '2.5rem', fontWeight: 700, color: '#F8FAFC' },
    h2: { fontSize: '2rem', fontWeight: 700, color: '#F8FAFC' },
    h3: { fontSize: '1.5rem', fontWeight: 600, color: '#F8FAFC' },
    h4: { fontSize: '1.25rem', fontWeight: 600, color: '#F8FAFC' },
    h5: { fontSize: '1rem', fontWeight: 600, color: '#F8FAFC' },
    h6: { fontSize: '0.875rem', fontWeight: 600, color: '#F8FAFC' },
    body1: { fontSize: '1rem', lineHeight: 1.6, color: '#E2E8F0' },
    body2: { fontSize: '0.875rem', color: '#94A3B8' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#090D16',
          color: '#F8FAFC',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
          backgroundColor: '#111827',
          color: '#F8FAFC',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#111827',
          color: '#F8FAFC',
          backgroundImage: 'none',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: '#38BDF8',
          color: '#090D16',
          '&:hover': {
            backgroundColor: '#7DD3FC',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.15)',
          color: '#F8FAFC',
          '&:hover': {
            borderColor: '#38BDF8',
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            color: '#F8FAFC',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.12)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.25)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#38BDF8',
              borderWidth: '1.5px',
            },
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#64748B',
            opacity: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#94A3B8',
          '&.Mui-focused': {
            color: '#38BDF8',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: '#F8FAFC',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111827',
          color: '#F8FAFC',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          color: '#E2E8F0',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#0F172A',
          '& .MuiTableCell-head': {
            color: '#38BDF8',
            fontWeight: 700,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.08)',
          color: '#E2E8F0',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#E2E8F0',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            color: '#38BDF8',
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            color: '#E2E8F0',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            '&.Mui-selected': {
              backgroundColor: '#38BDF8',
              color: '#090D16',
              fontWeight: 700,
            },
          },
        },
      },
    },
  },
})

export { ThemeProvider }
