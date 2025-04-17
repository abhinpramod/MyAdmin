import React from "react";
import { Chip } from "@mui/material";
import { ShieldCheck } from "lucide-react";

const StatusChip = ({ approvelstatus, isBlocked }) => {
    if (isBlocked) {
      return (
        <Chip 
          icon={<Lock size={16} />} 
          label="Blocked" 
          color="error" 
          variant="outlined" 
          size="small" 
        />
      );
    }
    if (approvelstatus === 'Rejected') {
      return (
        <Chip 
          icon={<X size={16} />} 
          label="Rejected" 
          color="error" 
          variant="outlined" 
          size="small" 
        />
      );
    }
    if (approvelstatus === 'Approved') {
      return (
        <Chip 
          icon={<ShieldCheck size={16} />} 
          label="Approved" 
          color="success" 
          variant="outlined" 
          size="small" 
        />
      );
    }
    return (
      <Chip 
        icon={<FileText size={16} />} 
        label="Pending" 
        color="warning" 
        variant="outlined" 
        size="small" 
      />
    );
  };
  
  export default StatusChip;