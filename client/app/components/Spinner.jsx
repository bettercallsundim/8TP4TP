import { memo } from "react";

const Spinner = memo(() => {
  return (
    <div className="flex items-center justify-center my-8">
      <span class="loaderrr"></span>
    </div>
  );
});

export default Spinner;
