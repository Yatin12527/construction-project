import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowRight, Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed relative overflow-hidden"
      style={{ backgroundImage: "url('/background.avif')" }}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-24 h-full backdrop-blur-sm sm:backdrop-blur-0">
          <div className="w-full max-w-sm mx-auto lg:w-96">
            {/* Header Logo */}
            <img
              src="/logo.png"
              alt="ProcureEngine"
              className="h-32 hidden sm:absolute top-0 left-0 w-auto mb-6 drop-shadow-xl brightness-200  sm:block"
            />

            <div className="mb-10">
              <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">
                Welcome back
              </h1>
              <p className="mt-3 text-sm text-zinc-200 font-medium leading-relaxed">
                Enter your credentials to access the workspace.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase ml-1 tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-zinc-300 group-focus-within:text-white transition-colors" />
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-400 outline-none transition-all duration-200 focus:bg-white/20 focus:border-white/40 focus:ring-1 focus:ring-white/50 shadow-lg"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-zinc-300 group-focus-within:text-white transition-colors" />
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-zinc-400 outline-none transition-all duration-200 focus:bg-white/20 focus:border-white/40 focus:ring-1 focus:ring-white/50 shadow-lg"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-zinc-100 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && (
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-10 text-center">
              <p className="text-sm font-medium text-zinc-300">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-white hover:underline underline-offset-4 decoration-white/30"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
