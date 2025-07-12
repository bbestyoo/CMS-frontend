"use client"
import { Button } from "../../components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useState } from "react";
import { useRouter } from 'next/navigation'
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;


const Signup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    
      const response = await fetch(
        `${baseURL}userauth/signup/`,
        {
          method: 'POST',
          body: JSON.stringify({ email: email }),
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Use 'include' to send cookies with the request
        }
      );
      
      const result = await response.json();

      if (response.ok) {
        console.log("success", result);
        router.push( '/register',
          )
        // router.push({
        //   pathname: '/register',
        //   query: {email: email}
        // })
      } else {
        console.error("Failed to create account:", result.message || response.statusText);
      }
    setIsLoading(false);
  
  
  }
  return (

    <div className="h-[100vh] flex items-center justify-center bg-gray-900">
      {/* for visuals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-16 h-16 bg-blue-500/10 rounded-full blur-lg animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-blue-400/10 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/3 w-32 h-32 bg-indigo-500/10 rounded-full blur-lg animate-pulse delay-700"></div>
      </div>


   <div className="p-10 w-1/3 bg-transparent shadow-xl border-none text-white">
  <div className="space-y-1">
    <div className="text-2xl font-semibold">Create an account</div>
    <div className="text-sm text-muted-foreground">
      Enter your email below to create your account
    </div>
  </div>
  <div className="grid gap-4 mt-6">
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
      className="text-black"
        id="email"
        type="email"
        placeholder="m@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="px-2">
        Or continue with
      </span>
    </div>
    <div className="grid grid-cols-2 gap-6 my-3">
      <div className="flex justify-center items-center gap-1 cursor-pointer hover:bg-black py-2 rounded-md" variant="outline">
        <FaGithub className="mx-1" />
        Github
      </div>
      <div className="flex justify-center items-center gap-1 cursor-pointer hover:bg-black py-2 rounded-md" variant="outline">
        <FaGoogle className="mx-1" />
        Google
      </div>
    </div>
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
    </div>
  </div>
  <div className="mt-6">
    <Button className="w-full bg-blue-800 hover:bg-black" onClick={handleSubmit} disabled={isLoading}>
      {isLoading ? "Loading..." : "Continue"}
    </Button>
  </div>
  <div className="flex justify-center text-white mt-4">Already have an account ?&nbsp;
    <button onClick={()=>router.push("/login")} className="hover:text-blue-800">login</button>
  </div>
</div>
    </div>

  );
};
export default Signup;