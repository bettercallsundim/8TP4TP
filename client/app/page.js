import Login from "./components/Login";

export default function page() {
  return (
    <div className="min-h-screen min-w-full container mx-auto bg-bng text-text flex items-center px-8 relative ">
      {/* <div className="w-full h-[400px] absolute bottom-0 left-0 right-0 ">
        <img className="w-full h-full" src="./bg.png" alt="" />
      </div> */}
      <div className="text-[70px] text-primary mt-20 relative z-10">
        <p>
          Social network <br /> ... but for foodies
        </p>
        <p className="text-center">
          <img
            className="w-[150px]  rounded mx-auto"
            src="https://media1.tenor.com/m/TzaUHHp9un4AAAAd/huh-cat-roblox-huh.gif"
            alt=""
          />
        </p>
      </div>
      <Login />
    </div>
  );
}
