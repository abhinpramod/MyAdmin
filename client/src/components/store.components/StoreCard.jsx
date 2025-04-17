import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Typography,
  IconButton
} from '@mui/material';
import { Eye, MoreVertical,User,MapPin,Mail,Phone,Store,FileDigit,Calendar,FileText,AlertCircle,Check,X,Lock,Unlock  } from 'lucide-react';
import StatusChip from './StatusChip';

const StoreCard = ({ 
  store, 
  onViewDetails, 
  onApprove, 
  onReject, 
  onMenuOpen,
  loading 
}) => {
  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
      
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button 
          size="small" 
          startIcon={<Eye size={18} />}
          onClick={() => onViewDetails(store)}
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
                onClick={() => onApprove(store._id)}
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
                onClick={() => onReject(store)}
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
              onClick={(e) => onMenuOpen(e, store)}
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