import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "../schemas/auth";
import type { SigninFormData } from "../schemas/auth";
import { useLogin } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../utils/errors";

const SigninForm = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data: SigninFormData) => {
    login(data, {
      onSuccess: () => {
        // cookie already set → user is authenticated
        navigate("/dashboard");
      },
    });
  };

  const errorMessage = error ? getApiErrorMessage(error) : null;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-black">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Sign In
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

        {/* API Error */}
        {errorMessage && (
          <p className="text-red-600 text-sm text-center">{errorMessage}</p>
        )}

        {/* Submit */}
        <button
          disabled={!isValid || isPending}
          type="submit"
          className="w-full bg-purple-400 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition disabled:opacity-50"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-gray-600">
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="text-purple-400 hover:underline font-medium"
        >
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default SigninForm;
