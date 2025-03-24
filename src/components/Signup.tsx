"use client";

import Image from "next/image";
import { MailOutline, LockOutlined, CalendarToday, Phone } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";

//Signup page
export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        birthday: "",
    });
    
    const router = useRouter();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
    
          const data = await res.json();
          if (res.ok) {
            router.push("/login");
          } else {
            alert(data.message || "Error occurred");
          }
        } catch (err) {
          console.error(err);
          alert("Something went wrong");
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
        <div className="relative flex justify-center items-center min-h-screen bg-white">
            <div className="relative w-[420px] p-8 bg-[#FEF8EE] shadow-lg rounded-xl z-10 top-[-10px]">
                <h2 className="text-3xl font-bold text-center text-[#4F3622]">Sign up</h2>
                <div className="mt-6 space-y-4">
                <div>
                    <label className="block text-[#4F3622] font-semibold">Name</label>
                    <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Fullname"
                    required
                    className="w-full bg-white rounded-full px-4 py-2 shadow-md border-none outline-none"
                    />
                </div>
                <div>
                    <label className="block text-[#4F3622] font-semibold">Birthday</label>
                    <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                    <input
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                        type="date"
                        placeholder="Select Date"
                        required
                        className="w-full border-none outline-none bg-transparent"
                    />
                    </div>
                </div>
                <div>
                    <label className="block text-[#4F3622] font-semibold">Tel</label>
                    <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                    <Phone className="mr-2 text-[#4F3622]" fontSize="small" />
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        type="tel"
                        placeholder="Telephone number"
                        required
                        className="w-full border-none outline-none bg-transparent"
                    />
                    </div>
                </div>
                <div>
                    <label className="block text-[#4F3622] font-semibold">Email</label>
                    <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                    <MailOutline className="mr-2 text-[#4F3622]" fontSize="small" />
                    <input
                        name="email"
                        value={formData.email} 
                        onChange={handleChange}
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full border-none outline-none bg-transparent"
                    />
                    </div>
                </div>
                <div>
                    <label className="block text-[#4F3622] font-semibold">Password</label>
                    <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                    <LockOutlined className="mr-2 text-[#4F3622]" fontSize="small" />
                    <input
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full border-none outline-none bg-transparent"
                    />
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <button type="submit" className="w-full py-2 bg-[#4F3622] text-white rounded-full font-semibold mt-4"
                        onMouseOver={(e) => onBrownMouseAction(e)}
                        onMouseOut={(e) => onBrownMouseAction(e)}>
                        Sign up
                    </button>
                </form>
                </div>
                <p className="mt-4 text-center text-sm text-[#4F3622]">
                Already have an account? <a href="/login" className="font-bold">Log in</a>
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
