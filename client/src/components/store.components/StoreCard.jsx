import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Typography,
  IconButton
} from '@mui/material';
import { Eye, MoreVertical, User, MapPin, Mail, FileDigit, Check, X } from 'lucide-react';
import StatusChip from './StatusChip';

const StoreCard = ({ 
  store, 
  onCardClick,       // New prop for card click
  onViewDetails, 
  onApprove, 
  onReject, 
  onMenuOpen,
  loading 
}) => {
  const handleDetailsClick = (e) => {
    e.stopPropagation();
    onViewDetails(store);
  };

  const handleApproveClick = (e) => {
    e.stopPropagation();
    onApprove(store._id);
  };

  const handleRejectClick = (e) => {
    e.stopPropagation();
    onReject(store);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    onMenuOpen(e, store);
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 1
        }
      }}
      onClick={() => onCardClick(store._id)}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <div className="flex justify-between items-start mb-2">
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {store.storeName}
          </Typography>
          <StatusChip 
            approvelstatus={store.approvelstatus} 
            isBlocked={store.isBlocked} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <User size={16} className="mr-2" />
            <span>{store.ownerName}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span>{store.city}, {store.state}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Mail size={16} className="mr-2" />
            <span className="truncate">{store.email}</span>
          </div>
          
          {store.gstNumber && (
            <div className="flex items-center text-sm text-gray-600">
              <FileDigit size={16} className="mr-2" />
              <span className="truncate">GST: {store.gstNumber}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardActions 
        sx={{ 
          justifyContent: 'space-between', 
          p: 2,
          '& button': {
            pointerEvents: 'auto' // Ensure buttons are clickable
          }
        }}
        onClick={(e) => e.stopPropagation()} // Prevent card click when clicking in actions area
      >
        <Button 
          size="small" 
          startIcon={<Eye size={18} />}
          onClick={handleDetailsClick}
          sx={{ textTransform: 'none' }}
        >
          Details
        </Button>
        
        <div className="flex space-x-2">
          {store.approvelstatus === 'Pending' && !store.isBlocked && (
            <>
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<Check size={18} />}
                onClick={handleApproveClick}
                sx={{ textTransform: 'none' }}
                disabled={loading}
              >
                Approve
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<X size={18} />}
                onClick={handleRejectClick}
                sx={{ textTransform: 'none' }}
                disabled={loading}
              >
                Reject
              </Button>
            </>
          )}
          {(store.approvelstatus === 'Approved' || store.approvelstatus === 'Rejected' || store.isBlocked) && (
            <IconButton
              size="small"
              onClick={handleMenuClick}
              disabled={loading}
            >
              <MoreVertical size={18} />
            </IconButton>
          )}
        </div>
      </CardActions>
    </Card>
  );
};

export default StoreCard;