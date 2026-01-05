import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schemas/auth";
import type { SignupFormData } from "../schemas/auth";
import { useRegister } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../utils/errors";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { mutate: signup, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data: SignupFormData) => {
    signup(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          // user is already logged in (cookie)
          navigate("/dashboard");
        },
      }
    );
  };

  const errorMessage = error ? getApiErrorMessage(error) : null;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-black">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Create an Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            {...register("name")}
            className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            {...register("email")}
            type="email"
            className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* API Error */}
        {errorMessage && (
          <p className="text-red-600 text-sm text-center">{errorMessage}</p>
        )}

        <button
          disabled={!isValid || isPending}
          type="submit"
          className="w-full bg-purple-400 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition disabled:opacity-50"
        >
          {isPending ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-gray-600">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-purple-400 hover:underline font-medium"
        >
          Sign In
        </a>
      </p>
    </div>
  );
};

export default SignUpForm;
