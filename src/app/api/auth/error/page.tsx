export default function AuthErrorPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-96 p-8 bg-[#FEF8EE] shadow-lg rounded-xl">
          <h2 className="text-3xl font-bold text-center text-[#4F3622]">Authentication Error</h2>
          <p className="mt-4 text-center text-[#4F3622]">
            There was an error during authentication. Please try again or contact support.
          </p>
          <div className="mt-6 flex justify-center">
            <a 
              href="/login" 
              className="px-6 py-2 bg-[#4F3622] text-white rounded-full font-semibold"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    );
  }