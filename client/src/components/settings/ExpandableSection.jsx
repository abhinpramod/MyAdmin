import React from 'react';
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider
} from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ExpandableSection = ({ 
  title, 
  expanded, 
  onToggle, 
  children 
}) => {
  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={onToggle} sx={{ px: 3, py: 2 }}>
          <ListItemText 
            primary={title} 
            primaryTypographyProps={{ variant: 'h6', fontWeight: 'medium' }}
          />
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: 3, pb: 3 }}>
          {children}
        </Box>
      </Collapse>
      <Divider />
    </>
  );
};

export default ExpandableSection;