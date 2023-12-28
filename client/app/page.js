import Login from "./components/Login";

export default function page() {
  return (
    <div className="min-h-screen min-w-full container mx-auto bg-bng text-text flex flex-col md:flex-row items-center px-4 md:px-8  justify-around">
      <div className="text-[35px] md:text-[70px] text-primary leading-[3rem] md:leading-[5rem]">
        <p>
          <span className="bg-primary text-text px-2 border-t-4 border-text">
            Democratic
          </span>{" "}
          Social network
          <br /> ... but for{" "}
          <span className="bg-primary text-text px-2 border-b-4 border-text">
            foodies
          </span>
          <img
            className="w-[150px] mt-4 md:mt-0  rounded md:float-end"
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
