"use client";

import TopMenuItem from "./TopMenuItem";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TopMenu() {
    
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated" && session;
    const router = useRouter();

    function onBrownMouseAction(event: React.SyntheticEvent) {
        if (event.type === "mouseover") {
        event.currentTarget.classList.remove("bg-[#4F3622]");
        event.currentTarget.classList.add("bg-[#422C1C]");
        } else {
        event.currentTarget.classList.remove("bg-[#422C1C]");
        event.currentTarget.classList.add("bg-[#4F3622]");
        }
    }

    function onWhiteMouseAction(event: React.SyntheticEvent) {
        if (event.type === "mouseover") {
        event.currentTarget.classList.remove("bg-white");
        event.currentTarget.classList.add("bg-[#D9D9D9]");
        } else {
        event.currentTarget.classList.remove("bg-[#D9D9D9]");
        event.currentTarget.classList.add("bg-white");
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full flex justify-between items-center p-6 z-50 bg-white">
            <div className="text-[#5B5B5B] text-2xl font-bold">MUHAHA</div>
            <div className="flex space-x-4 ml-auto">
                <TopMenuItem
                title="ABOUT US"
                pageRef="/about"
                styles="bg-[#4F3622] text-white text-xs rounded-full drop-shadow-md px-4 py-2"
                onMouseOver={(e) => onBrownMouseAction(e)}
                onMouseOut={(e) => onBrownMouseAction(e)}
                onClick={() => router.push("/aboutus")}
                />
                <TopMenuItem
                title="RESERVE"
                pageRef="/reserve"
                styles="bg-white text-[#4F3622] text-xs rounded-full drop-shadow-md px-4 py-2"
                onMouseOver={(e) => onWhiteMouseAction(e)}
                onMouseOut={(e) => onWhiteMouseAction(e)}
                />
                {isAuthenticated ? (
                <TopMenuItem
                    title="LOG OUT"
                    pageRef="#"
                    styles="bg-[#4F3622] text-white text-xs rounded-full drop-shadow-md px-4 py-2"
                    onMouseOver={(e) => onBrownMouseAction(e)}
                    onMouseOut={(e) => onBrownMouseAction(e)}
                    onClick={() => {
                        signOut({ 
                            callbackUrl: '/login',
                            redirect: true
                        });
                    }}
                />
                ) : (
                <TopMenuItem
                    title="LOG IN"
                    pageRef="/login"
                    styles="bg-[#4F3622] text-white text-xs rounded-full drop-shadow-md px-4 py-2"
                    onMouseOver={(e) => onBrownMouseAction(e)}
                    onMouseOut={(e) => onBrownMouseAction(e)}
                />
                )}
            </div>
        </div>
    );
}