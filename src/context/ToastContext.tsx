import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Snackbar, Alert, AlertColor, Slide, SlideProps } from '@mui/material';

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function SlideDownTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [duration, setDuration] = useState(4500);

  const showToast = useCallback((msg: string, sev: AlertColor = 'info', dur: number = 4500) => {
    setMessage(msg);
    setSeverity(sev);
    setDuration(dur);
    setOpen(true);
  }, []);

  const hideToast = useCallback(() => {
    setOpen(false);
  }, []);

  // Intercept window.alert so that ANY remaining or dynamic alert() calls render as a toast
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (alertMsg: any) => {
      const formatted = typeof alertMsg === 'string' ? alertMsg : JSON.stringify(alertMsg);
      const isError = /fail|error|invalid|reject|not found/i.test(formatted);
      const isSuccess = /success|created|applied|complete|saved/i.test(formatted);
      const sev: AlertColor = isError ? 'error' : isSuccess ? 'success' : 'info';
      showToast(formatted, sev);
    };

    return () => {
      window.alert = originalAlert;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideDownTransition}
        sx={{
          top: { xs: 20, sm: 28 },
          zIndex: 99999,
        }}
      >
        <Alert
          onClose={hideToast}
          severity={severity}
          variant="filled"
          elevation={8}
          sx={{
            minWidth: { xs: 280, sm: 380 },
            maxWidth: { xs: '90vw', sm: 600 },
            borderRadius: 2.5,
            fontWeight: 500,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.28)',
            fontSize: '0.92rem',
            alignItems: 'center',
            py: 1,
            px: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.4rem',
              mr: 1.5,
            },
            '& .MuiAlert-message': {
              wordBreak: 'break-word',
              lineHeight: 1.5,
            },
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
