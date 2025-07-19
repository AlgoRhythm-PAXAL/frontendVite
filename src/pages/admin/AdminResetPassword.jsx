import ResetPassword from "../../components/admin/authentication/ResetPassword";

const AdminResetPassword = () => {
  return (
    <div className="flex flex-col h-screen bg-Background items-center justify-center relative">
      <ResetPassword />
      <div className="absolute bottom-0 w-full">
        <div className="relative w-full h-[200px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 390"
            className="absolute bottom-0 w-full"
          >
            <path
              fill="#1f818c"
              fillOpacity="1"
              d="M0,192L60,197.3C120,203,240,213,360,229.3C480,245,600,267,720,250.7C840,235,960,181,1080,165.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1400 280"
            className="absolute bottom-0 w-full"
          >
            <path
              fill="#000000"
              fillOpacity="1"
              d="M0,192L60,197.3C120,203,240,213,360,197.3C480,181,600,139,720,122.7C840,107,960,117,1080,133.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;
