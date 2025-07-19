import { Link } from "react-router-dom";

const MainMenuButton = ({ text, link, icon }) => {
  return (
    // <>
    // <a
    // href={link}
    // className="
    // ">
    // <p className="
    // bg-Primary  text-white font-semibold text-xl
    // py-4 w-[450px] text-center rounded-md
    // mx-auto
    // hover:bg-white hover:border-Primary hover:border-2
    // hover:shadow-lg hover:shadow-slate-400
    // hover:text-Primary ">  {text} </p>
    // </a>
    // </>

    <>
      <Link
        to={link}
        className="flex items-center p-6 space-x-4 bg-white rounded-lg border border-gray-200 
              hover:border-Primary hover:bg-gray-50 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-Primary focus:ring-offset-2"
      >
        <span className="text-Primary">{icon}</span>
        <span className="text-lg font-medium text-gray-700">{text}</span>
      </Link>
    </>
  );
};

export default MainMenuButton;
