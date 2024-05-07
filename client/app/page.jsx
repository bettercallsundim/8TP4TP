import Login from "./components/Login";

export default function page() {
  return (
    <div className="h-[calc(100vh-4rem)] min-w-full container mx-auto bg-bng text-text flex flex-col md:flex-row items-center px-2 md:px-8  justify-center md:justify-around overflow-y-hidden">
      <div className="">
        <p className="md:text-[50px] text-[30px]  text-primary leading-[3rem] md:leading-[5rem]">
          <span className="bg-primary text-text px-2 border-t-4 border-text">
            Democratic <br className="md:hidden" />
          </span>{" "}
          Social network
          <br />{" "}
          <span className=" text-gray-500 text-[25px] md:text-[50px] px-2 border-text">
            {" "}
            ... wait democratic ?
          </span>
          <img
            className="w-[150px] mx-auto mt-12 md:mt-0  rounded md:float-end"
            src="https://media1.tenor.com/m/TzaUHHp9un4AAAAd/huh-cat-roblox-huh.gif"
            alt=""
          />
        </p>
        <p className="text-center"></p>
      </div>
      <div className=" relative  flex items-center justify-center md:w-[350px] h-[100px] lg:h-[500px]  overflow-hidden">
        <div className="hidden lg:block w-[100px] h-full bg-primary  absolute left-0"></div>
        <div className="hidden lg:block w-[100px] h-full bg-secondary  absolute right-0"></div>
        <div className="hidden lg:block w-[100px] h-full bg-accent   absolute right-[120px]"></div>
        {/* <div className="hidden md:block w-[700px] h-full bg-sky-300  absolute"></div>
        <div className="hidden md:block w-[700px] h-full bg-sky-400   absolute top-[50%]"></div> */}

        <Login />
      </div>
    </div>
  );
}
