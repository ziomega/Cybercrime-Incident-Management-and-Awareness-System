import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup as signupApi } from '../api/auth'; // Assuming you have a signup function in your API

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      await signupApi({ username, email, password });
      navigate('/login'); // Redirect to login after successful signup
    } catch (err) {
      setError(err.message || 'Failed to create an account. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="mb-6 text-4xl font-bold">Create Account</h1>
      {error && (
        <div className="w-full max-w-md p-4 mb-6 text-center text-red-400 bg-red-900 bg-opacity-25 border border-red-400 rounded-lg">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 p-10 rounded-xl bg-[oklch(0.22_0.01_260)] w-full max-w-md shadow-lg"
      >
        <div className="flex flex-col">
          <label className="mb-3 text-base font-medium">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-4 rounded-md border border-[oklch(0.4_0.01_260)] bg-[oklch(0.17_0.01_260)] text-[oklch(0.97_0.01_260)] text-base transition-colors duration-200 focus:outline-none focus:border-[oklch(0.6_0.15_260)] focus:ring-2 focus:ring-[oklch(0.6_0.15_260/0.3)]"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-3 text-base font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-4 rounded-md border border-[oklch(0.4_0.01_260)] bg-[oklch(0.17_0.01_260)] text-[oklch(0.97_0.01_260)] text-base transition-colors duration-200 focus:outline-none focus:border-[oklch(0.6_0.15_260)] focus:ring-2 focus:ring-[oklch(0.6_0.15_260/0.3)]"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-3 text-base font-medium">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-4 rounded-md border border-[oklch(0.4_0.01_260)] bg-[oklch(0.17_0.01_260)] text-[oklch(0.97_0.01_260)] text-base transition-colors duration-200 focus:outline-none focus:border-[oklch(0.6_0.15_260)] focus:ring-2 focus:ring-[oklch(0.6_0.15_260/0.3)]"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-3 text-base font-medium">Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="p-4 rounded-md border border-[oklch(0.4_0.01_260)] bg-[oklch(0.17_0.01_260)] text-[oklch(0.97_0.01_260)] text-base transition-colors duration-200 focus:outline-none focus:border-[oklch(0.6_0.15_260)] focus:ring-2 focus:ring-[oklch(0.6_0.15_260/0.3)]"
          />
        </div>
        <button
          type="submit"
          className="p-4 mt-2 text-lg font-bold rounded-md cursor-pointer bg-[oklch(0.6_0.15_260)] text-[oklch(0.17_0.01_260)] transition-transform duration-100 ease-in-out hover:bg-[oklch(0.7_0.15_260)] active:scale-[0.98]"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-6 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-[oklch(0.6_0.15_260)] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default Signup;