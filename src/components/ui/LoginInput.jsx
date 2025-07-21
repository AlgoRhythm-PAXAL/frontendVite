const LoginInput = (props) => {
  return (
    <input
      {...props}
      className="
      w-full 
      pl-10 pr-3 py-2 
      bg-opacity-50 
      rounded-lg 
      border 
      border-Primary 
      placeholder-gray-400 
      focus:outline-none
      focus:ring-2
      focus:ring-Primary
      transition-all
      duration-200"
    />
  );
};

export default LoginInput;
