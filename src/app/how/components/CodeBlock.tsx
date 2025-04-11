'use client';

import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'python', title }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        overflow: 'hidden',
        borderRadius: 2,
        mb: 3,
        position: 'relative',
        bgcolor: '#1E1E3F',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {title && (
        <Box 
          sx={{ 
            px: 2, 
            py: 1, 
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: 'monospace'
            }}
          >
            {title}
          </Typography>
          <IconButton 
            size="small" 
            onClick={copyToClipboard}
            sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      <Box 
        sx={{ 
          p: 2,
          maxHeight: '400px',
          overflow: 'auto',
          position: 'relative',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          }
        }}
      >
        <pre style={{ 
          margin: 0, 
          fontFamily: 'monospace', 
          fontSize: '14px',
          lineHeight: 1.5,
          color: 'rgba(255, 255, 255, 0.9)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </Box>
      {!title && (
        <IconButton 
          size="small" 
          onClick={copyToClipboard}
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8,
            color: 'rgba(255, 255, 255, 0.8)',
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.4)',
            }
          }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      )}
    </Paper>
  );
};

export default CodeBlock; 