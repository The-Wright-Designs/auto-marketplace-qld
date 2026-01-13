export default function SuccessState() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-grey/10">
      <div className="bg-white p-5 rounded-md shadow-md max-w-md w-full text-center grid gap-5">
        <div className="margin-50px text-green-600">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-subheading text-black margin-18px">
          Password Reset Successful
        </h2>
        <p className="text-paragraph margin-50px">
          Your password has been successfully reset.
        </p>
        <p className="text-paragraph desktop:text-paragraph text-black/50">
          Redirecting to login...
        </p>
      </div>
    </div>
  );
}
