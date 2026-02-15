import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="shadow-xl rounded-xl overflow-hidden">
        <SignUp />
      </div>
    </div>
  );
}