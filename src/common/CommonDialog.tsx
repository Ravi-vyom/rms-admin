"use client";
import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | false;

type CommonDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  content?: React.ReactNode;
  actions?: React.ReactNode;
  dialogProps?: Omit<DialogProps, "open" | "onClose">;
  maxWidth?: Breakpoint;
};

const CommonDialog: React.FC<CommonDialogProps> = ({
  open,
  onClose,
  title = "",
  content,
  actions,
  dialogProps = {},
  maxWidth = "sm",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      {...dialogProps}
    >
      {title && (
        <Box sx={{ backgroundColor: "#1976d2", color: "white" }}>
          <DialogTitle>{title}</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              backgroundColor: "white",
              color: "black",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
              },
            })}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      {content && <DialogContent dividers>{content}</DialogContent>}
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default CommonDialog;
