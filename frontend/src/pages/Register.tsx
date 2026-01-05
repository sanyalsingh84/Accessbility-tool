import HabitsImg from "../assets/register.svg";
import SignUpForm from "../components/SignUpForm";

export default function Register() {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <img
          className="w-full h-full object-cover"
          src={HabitsImg}
          alt="User avatar"
        />
      </div>
      <div className="w-1/2 flex items-center justify-center bg-white">
        <SignUpForm />
      </div>
    </div>
  );
}
