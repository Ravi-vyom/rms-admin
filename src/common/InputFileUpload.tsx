"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { Box, IconButton, Typography } from "@mui/material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload({
  name,
  value,
  onChange,
  defaultImage,
}: {
  name: string;
  value: File | string | null;
  onChange: (file: File | null) => void;
  defaultImage?: string; // for pre-filled image in edit
}) {
  const [preview, setPreview] = React.useState<string | null>(null);
  function isFile(value: any): value is File {
    return (
      value &&
      typeof value === "object" &&
      typeof value.name === "string" &&
      typeof value.size === "number"
    );
  }

  React.useEffect(() => {
    if (isFile(value)) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === "string" && value) {
      setPreview(value);
    } else if (defaultImage) {
      setPreview(defaultImage);
    } else {
      setPreview(null);
    }
  }, [value, defaultImage]);

  const handleDelete = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography variant="body1">{name}</Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload Image
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              onChange(file);
            }}
          />
        </Button>

        {preview && (
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      {preview && (
        <Box
          component="img"
          src={preview}
          alt="Preview"
          sx={{ width: 120, height: 120, borderRadius: 2, objectFit: "cover" }}
        />
      )}
    </Box>
  );
}
