'use client';

import React from 'react';
import { Box, Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

export default function RightSidebar() {
  const news = [
    { title: 'AI Tech Hiring surge in 2026', time: '1h ago', readers: '14,290 readers' },
    { title: 'Remote Work Trends Shift', time: '3h ago', readers: '8,410 readers' },
    { title: 'Next.js 16 Released with App Router Boost', time: '5h ago', readers: '22,100 readers' },
    { title: 'Startup Funding Rebounds Globally', time: '12h ago', readers: '5,630 readers' },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #E0E0E0',
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            LinkedIn News
          </Typography>
          <InfoIcon sx={{ fontSize: 16, color: '#666666' }} />
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Top stories
        </Typography>

        <List disablePadding>
          {news.map((item, index) => (
            <ListItem
              key={index}
              disableGutters
              sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#F3F2EF' }, borderRadius: 1, p: 0.5 }}
            >
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    • {item.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', pl: 1.5 }}>
                    {item.time} • {item.readers}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
