import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import { X } from "lucide-react";

const ImageModal = ({ imageModal, setImageModal }) => {
  return (
    <Modal
      open={imageModal.open}
      onClose={() => setImageModal({ open: false, src: "" })}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ outline: "none" }}>
        <img
          src={imageModal.src}
          alt="Enlarged Document"
          style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "8px" }}
        />
        <IconButton
          onClick={() => setImageModal({ open: false, src: "" })}
          sx={{ mt: 2, display: "block", mx: "auto" }}
          variant="contained"
          color=""
        >
          <X />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default ImageModal;