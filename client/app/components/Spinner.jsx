import { memo } from "react";

const Spinner = memo(({ inline }) => {
  if (inline) {
    return <span className="loaderrr w-[10px] h-[10px]"></span>;
  }
  return (
    <div className="flex items-center justify-center my-8">
      <span className="loaderrr"></span>
    </div>
  );
});

export default Spinner;
