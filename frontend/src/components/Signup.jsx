import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup as signupApi } from "../api/auth";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.first_name) return setError("Please enter your first name.");
      if (!form.last_name) return setError("Please enter your last name.");
    }
    if (step === 2 && !form.email) return setError("Please enter your email.");
    if (step === 3) {
      if (!form.password) return setError("Please create a password.");
      if (form.password.length < 8) return setError("Password must be at least 8 characters.");
      if (form.password !== form.confirmPassword)
        return setError("Passwords do not match.");
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      // Create payload matching the backend model
      const payload = {
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || null,
        role: form.role,
      };
      await signupApi(payload);
      navigate("/login");
    } catch (err) {
      setError(err.err || "Failed to create an account. Please try again.");
    }
  };

  const steps = [1, 2, 3];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-backdrop-blur-sm p-4">
      <div className="bg-[oklch(0.17_0.01_260)]/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-full max-w-lg border border-[oklch(0.35_0.05_260)] relative overflow-hidden">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {step < 4 ? "Create Your Account" : "All Set!"}
        </h1>

        {/* Step circles */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                    step >= s
                      ? "bg-[oklch(0.7_0.15_260)] text-[oklch(0.15_0.02_260)]"
                      : "bg-[oklch(0.3_0.02_260)] text-[oklch(0.7_0.02_260)]"
                  }`}
                >
                  {s}
                </div>
                {i !== steps.length - 1 && (
                  <div
                    className={`w-10 h-[2px] transition-all duration-300 ${
                      step > s
                        ? "bg-[oklch(0.7_0.15_260)]"
                        : "bg-[oklch(0.35_0.05_260)]"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 text-sm text-center text-red-400 border border-red-400 bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        {/* Step forms */}
        <div className="transition-all duration-500 ease-in-out">
          {step === 1 && (
            <div>
              <label className="block mb-3 text-base font-medium">
                👋 What is your name?
              </label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full mb-4 p-4 rounded-lg bg-[oklch(0.2_0.01_260)] border border-[oklch(0.4_0.02_260)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.15_260)]"
              />
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full p-4 rounded-lg bg-[oklch(0.2_0.01_260)] border border-[oklch(0.4_0.02_260)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.15_260)]"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block mb-3 text-base font-medium">
                📧 What is your email?
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full mb-4 p-4 rounded-lg bg-[oklch(0.2_0.01_260)] border border-[oklch(0.4_0.02_260)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.15_260)]"
              />
              <label className="block mb-3 text-base font-medium">
                📱 Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full p-4 rounded-lg bg-[oklch(0.2_0.01_260)] border border-[oklch(0.4_0.02_260)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.15_260)]"
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block mb-3 text-base font-medium">
                 Create a password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password (min. 8 characters)"
                className="w-full mb-4 p-4 rounded-lg bg-[oklch(0.2_0.01_260)] border border-[oklch(0.4_0.02_260)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.15_260)]"
              />
              <label className="block mb-3 text-base font-medium">
                ✅ Confirm your password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full p-4 rounded-lg bg-[oklch(0.2_0.01_260)] border border-[oklch(0.4_0.02_260)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.15_260)]"
              />
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center text-center py-8">
              <CheckCircle className="w-16 h-16 text-[oklch(0.7_0.15_260)] mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                You're all set, {form.first_name}!
              </h2>
              <p className="text-[oklch(0.8_0.02_260)]">
                Redirecting you to login...
              </p>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="flex justify-between mt-10">
            {step > 1 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[oklch(0.3_0.05_260)] hover:bg-[oklch(0.35_0.05_260)] transition-all"
              >
                <ArrowLeft size={18} /> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 font-semibold rounded-lg bg-[oklch(0.7_0.15_260)] hover:bg-[oklch(0.75_0.15_260)] transition-all"
              >
                Next <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={async () => {
                  try {
                    // Create payload matching the backend model
                    const payload = {
                      email: form.email,
                      password: form.password,
                      first_name: form.first_name,
                      last_name: form.last_name,
                      phone: form.phone || null,
                      role: form.role,
                    };
                    await signupApi(payload);
                    setStep(4);  // only go to success step on real success
                    setTimeout(() => {
                      navigate("/login");
                    }, 2000);
                  } catch (err) {
                    setError(err.message || "Failed to create an account. Please try again.");
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 font-semibold rounded-lg bg-[oklch(0.7_0.15_260)] hover:bg-[oklch(0.75_0.15_260)] transition-all"
              >
                Sign Up <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[oklch(0.7_0.15_260)] font-semibold hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
