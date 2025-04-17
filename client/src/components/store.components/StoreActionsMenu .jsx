import React from 'react';
import { 
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import { Lock, Unlock } from 'lucide-react';

const StoreActionsMenu = ({ 
  anchorEl, 
  onClose, 
  store, 
  onBlock, 
  onUnblock 
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      {store?.isBlocked ? (
        <MenuItem 
          onClick={() => {
            onUnblock(store._id);
            onClose();
          }}
          sx={{ color: 'success.main' }}
        >
          <ListItemIcon>
            <Unlock size={18} />
          </ListItemIcon>
          Unblock Store
        </MenuItem>
      ) : (
        <MenuItem 
          onClick={() => {
            onBlock(store?._id);
            onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Lock size={18} />
          </ListItemIcon>
          Block Store
        </MenuItem>
      )}
    </Menu>
  );
};

export default StoreActionsMenu;