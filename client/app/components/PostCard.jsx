import React, { useState } from "react";

export default function InstagramPost() {
  const [checked, setChecked] = React.useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return <div></div>;
}
