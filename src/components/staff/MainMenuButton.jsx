const MainMenuButton = ({ text, link }) => {
  return (
    <>
      <a
        href={link}
        className="
        "
      >
        <p
          className="
        bg-Primary  text-white font-semibold text-xl
        py-4 w-[450px] text-center rounded-md
        mx-auto 
        hover:bg-white hover:border-Primary hover:border-2
        hover:shadow-lg hover:shadow-slate-400 
        hover:text-Primary "
        >
          {' '}
          {text}{' '}
        </p>
      </a>
    </>
  );
};

export default MainMenuButton;
