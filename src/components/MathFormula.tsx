import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Box, Typography } from '@mui/material';

interface MathFormulaProps {
  math?: string;
  block?: boolean;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ math, block = true }) => {
  const renderedHtml = useMemo(() => {
    if (!math || !math.trim()) return '';

    // If string has unescaped double newlines or LaTeX align syntax, format cleanly
    let formula = math.trim();
    // Wrap multiple lines in aligned block if multiple equations present
    if (formula.includes('\\\\') || formula.includes('\n')) {
      const cleanLines = formula.split('\n').join(' \\\\ ');
      formula = `\\begin{aligned} ${cleanLines} \\end{aligned}`;
    }

    try {
      return katex.renderToString(formula, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: block,
          throwOnError: false,
        });
      } catch (e) {
        console.warn('KaTeX render fallback:', e);
        return '';
      }
    }
  }, [math, block]);

  if (!math) return null;

  if (!renderedHtml) {
    return (
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'monospace',
          p: 1.5,
          borderRadius: 1,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#EFF6FF'),
          color: (theme) => (theme.palette.mode === 'dark' ? '#93C5FD' : '#1E40AF'),
        }}
      >
        {math}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        overflowX: 'auto',
        my: 1.5,
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0B132B' : '#F0F7FF'),
        border: '1px solid',
        borderColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#BFDBFE'),
        color: (theme) => (theme.palette.mode === 'dark' ? '#93C5FD' : '#1E40AF'),
        textAlign: 'center',
        '& .katex-display': {
          my: 0.5,
        },
        '& .katex': {
          fontSize: { xs: '0.95rem', sm: '1.05rem' },
          lineHeight: 1.6,
        },
      }}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

export default MathFormula;
