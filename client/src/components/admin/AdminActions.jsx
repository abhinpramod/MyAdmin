import { Tooltip, IconButton } from "@mui/material";
import React from "react";


import { Edit, Block, CheckCircle, Delete } from "@mui/icons-material";

const AdminActions = ({ admin, onEdit, onBlock, onDelete }) => {
  return (
    <>
      <Tooltip title="Edit">
        <IconButton
          onClick={() => onEdit(admin)}
          color="primary"
          style={{ marginRight: "8px" }}
        >
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title={admin.isBlocked ? "Unblock" : "Block"}>
        <IconButton
          onClick={() => onBlock(admin)}
          color={admin.isBlocked ? "success" : "warning"}
          style={{ marginRight: "8px" }}
        >
          {admin.isBlocked ? <CheckCircle /> : <Block />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          onClick={() => onDelete(admin)}
          color="error"
        >
          <Delete />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default AdminActions;