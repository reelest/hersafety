import { useEffect, useState } from "react";
import Template from "./Template";
import { Box } from "@mui/material";

export default function ImageView({ value, ...props }) {
  const [src, setSrc] = useState(false);
  useEffect(() => {
    if (!value) {
      return;
    } else if (typeof value === "string") {
      setSrc(value);
      return;
    } else {
      const url = URL.createObjectURL(value);
      setSrc(url);
      return () => {
        setSrc(null);
        URL.revokeObjectURL(url);
      };
    }
  }, [value]);
  return (
    <Template
      as={Box}
      templateAs="img"
      src={src}
      className="rounded-t"
      sx={{
        backgroundColor: "gray.light",
        color: "primary.dark",
        flexGrow: 1,
        width: "auto",
        minHeight: "10rem",
        maxWidth: "20rem",
        "table &": {
          minHeight: "2rem",
          maxHeight: "2rem",
          borderRadius: "0.125rem",
        },
      }}
      props={props}
    />
  );
}
