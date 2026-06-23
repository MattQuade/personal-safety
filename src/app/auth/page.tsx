"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    setLoading(true);
    setStatus("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setStatus("Logged in successfully!");
        router.push("/settings");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setStatus("Check your email to confirm your account!");
      }
    } catch (error: any) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {isLogin ? "Login" : "Create Account"}
      </h1>

      <input 
        type="email" 
        placeholder="Email Address" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        className="border p-4 rounded-2xl w-full mb-4"
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        className="border p-4 rounded-2xl w-full mb-6"
      />

      <button 
        onClick={handleAuth}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl text-lg font-medium mb-4 disabled:opacity-50"
      >
        {loading ? "Processing..." : (isLogin ? "Login" : "Create Account")}
      </button>

      <button 
        onClick={() => setIsLogin(!isLogin)}
        className="w-full text-blue-600 font-medium"
      >
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
      </button>

      {status && <p className="text-center mt-6 text-sm">{status}</p>}
    </div>
  );
}