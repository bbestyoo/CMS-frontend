"use client"
import { Button } from "../../components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useState } from "react";
import { useRouter } from 'next/navigation'
const baseURL = process.env.BACKEND_URL;


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


    <Card className="mx-auto p-10 h-auto w-fit">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline">
            <FaGithub className="mx-1" />
            Github
          </Button>
          <Button variant="outline">
            <FaGoogle className="mx-1" />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Loading..." : "Continue"}
        </Button>
      </CardFooter>
    </Card>
  );
};
export default Signup;