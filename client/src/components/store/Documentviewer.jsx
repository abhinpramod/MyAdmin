// src/components/DocumentViewer.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Download, X as CloseIcon } from 'lucide-react';

const DocumentViewer = ({ open, onClose, documentUrl, title }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <div>
          <IconButton 
            href={documentUrl} 
            download 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ mr: 1 }}
          >
            <Download size={20} />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon size={20} />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        overflow: 'hidden',
        p: 0
      }}>
        <img 
          src={documentUrl} 
          alt={title}
          style={{ 
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/600x800?text=Document+Not+Found';
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;