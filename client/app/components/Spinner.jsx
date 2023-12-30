import { memo } from "react";

const Spinner = memo(({ inline }) => {
  if (inline) {
    return <span className="loaderrr w-[15px] h-[15px]"></span>;
  }
  return (
    <div className="flex items-center justify-center my-8 w-[48px] h-[48px]">
      <span className="loaderrr"></span>
    </div>
  );
});

export default Spinner;
