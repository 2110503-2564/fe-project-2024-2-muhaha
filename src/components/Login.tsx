"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; 
import Image from "next/image";
import { MailOutline, LockOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            redirect: false,
            email: email,
            password: password,
        });

        if (res?.error) {
            alert("Login failed. Please check your credentials and try again.");
        } else {
            router.push("/homepage");
        }
    };

    function onBrownMouseAction(event: React.SyntheticEvent){
        if(event.type === "mouseover"){
            event.currentTarget.classList.remove("bg-[#4F3622]");
            event.currentTarget.classList.add("bg-[#422C1C]");
        }else{
            event.currentTarget.classList.remove("bg-[#422C1C]");
            event.currentTarget.classList.add("bg-[#4F3622]");
        }
    }

    return (
        <div className="relative h-[100vh] flex items-center justify-center bg-white">
            <div className="relative w-96 p-8 bg-[#FEF8EE] shadow-lg rounded-xl z-10 top-[-60px]">
                <h2 className="text-3xl font-bold text-center text-[#4F3622]">Log in</h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md ">
                        <MailOutline className="mr-2 text-[#4F3622]" fontSize="small" />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full border-none outline-none bg-transparent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                        <LockOutlined className="mr-2 text-[#4F3622]" fontSize="small" /> 
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full border-none outline-none bg-transparent"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-2 bg-[#4F3622] text-white rounded-full font-semibold"
                        onMouseOver={(e) => onBrownMouseAction(e)}
                        onMouseOut={(e) => onBrownMouseAction(e)}>
                        Log in
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-[#4F3622]">
                    Don't have an account? <a href="/signup" className="font-bold">Sign up</a>
                </p>
            </div>
            <div className="absolute bottom-0 w-full">
                <Image
                    src="/img/login/Vector.png"
                    alt="Wave background"
                    layout="intrinsic"
                    width={1920}
                    height={120}
                    className="w-full"
                />
            </div>
        </div>
    );
}