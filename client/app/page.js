import Login from "./components/Login";

export default function page() {
  return (
    <div className="min-h-screen min-w-full container mx-auto bg-bng text-text flex items-center px-8 relative justify-around">
      <div className="text-[70px] text-primary  relative z-10 leading-[5rem]">
        <p>
          <span className="bg-primary text-text px-2 border-t-4 border-text">
            Democratic
          </span>{" "}
          Social <br /> ... but for{" "}
          <span className="bg-primary text-text px-2 border-b-4 border-text">
            foodies
          </span>
          <span className="rotate-90 inline-block">network</span>
          <img
            className="w-[150px]  rounded float-end"
            src="https://media1.tenor.com/m/TzaUHHp9un4AAAAd/huh-cat-roblox-huh.gif"
            alt=""
          />
        </p>
        <p className="text-center"></p>
      </div>
      <div className=" loginBg rounded-md flex items-center justify-center">
        <Login />
      </div>
    </div>
  );
}
