import Login from "./components/Login";

export default function page() {
  return (
    <div className="min-h-screen min-w-full container mx-auto bg-bng text-text flex flex-col md:flex-row items-center px-4 md:px-8  justify-center md:justify-around overflow-y-hidden">
      <div className="">
        <p className="md:text-[50px] text-[35px]  text-primary leading-[3rem] md:leading-[5rem]">
          <span className="bg-primary text-text px-2 border-t-4 border-text">
            Democratic
          </span>{" "}
          Social network
          <br /> ... but for{" "}
          <span className="bg-primary text-text px-2 border-b-4 border-text">
            foodies
          </span>
          <img
            className="w-[150px] mx-auto mt-12 md:mt-0  rounded md:float-end"
            src="https://media1.tenor.com/m/TzaUHHp9un4AAAAd/huh-cat-roblox-huh.gif"
            alt=""
          />
        </p>
        <p className="text-center"></p>
      </div>
      <div className=" relative  flex items-center justify-center md:w-[500px] h-[100px] md:h-[500px] rounded-full overflow-hidden">
        <div className="hidden md:block w-[700px] h-[100px] bg-sky-300 -rotate-45 absolute"></div>
        <div className="hidden md:block w-[700px] h-[100px] bg-sky-400 -rotate-45  absolute top-[10%]"></div>

          <Login />

      </div>
    </div>
  );
}
