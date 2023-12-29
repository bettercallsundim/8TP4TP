import { memo } from "react";

const Spinner = memo(({ inline }) => {
  if (inline) {
    return <span className="loaderrr w-[20px] h-[20px]"></span>;
  }
  return (
    <div className="flex items-center justify-center my-8">
      <span className="loaderrr"></span>
    </div>
  );
});

export default Spinner;
