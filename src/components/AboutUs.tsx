"use client";

import React from "react";
import Image from "next/image";
import { GitHub, LinkedIn, Code, Brush, Storage } from "@mui/icons-material";

//AboutUs page
const AboutUs = () => {
    const teamMembers = [
        {
            id: "01",
            name: "Pooh",
            cucode:"6733009021 Krittapat Tragoolpua",
            role: "Backend & State Management",
            image: "/img/aboutus/pooh.jpg",
            description: "Specializes in implementing API integrations, data fetching, and managing global state using React Context or Redux. Ensures efficient data handling and business logic across the application.",
            responsibilities: [
                "Implements API integrations and data fetching",
                "Manages global state using React Context or Redux",
                "Ensures efficient data handling and business logic"
            ],
            icon: <Storage className="text-blue-600 text-2xl" />
        },
        {
            id: "02",
            name: "Kaewkla",
            cucode:"6733022121 Kaewkla Sroykabkaew",
            role: "Frontend Development & UI Implementation",
            image: "/img/aboutus/kaew.jpg", 
            description: "Expert in developing React components based on UX/UI designs, implementing styling using Tailwind CSS and Material UI, and ensuring responsive and accessible interfaces.",
            responsibilities: [
                "Develops React components based on the UX/UI design",
                "Implements styling using Tailwind CSS or Material UI",
                "Ensures responsiveness and accessibility"
            ],
            icon: <Code className="text-green-600 text-2xl" />
        },
        {
            id: "03",
            name: "Champ",
            cucode:"6733119421 Norapat Prombute",
            role: "UX/UI Design & Frontend Enhancements",
            image: "/img/aboutus/champ.jpg",
            description: "Creative designer focusing on user flows, wireframes, and UI component creation. Refines interfaces for better usability and enhances overall user experience.",
            responsibilities: [
                "Designs user flows and wireframes",
                "Creates and refines UI components for better usability",
                "Enhances the user experience and smooth interactions"
            ],
            icon: <Brush className="text-purple-600 text-2xl" />
        }
    ];

    return (
        <div className="min-h-screen bg-[#ffedd1]">
        <div className="bg-white py-16 mt-[5%]">
            <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Our Dream Team
            </h1>
            </div>
        </div>
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {teamMembers.map((member) => (
                <div 
                key={member.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:transform hover:scale-105"
                >
                <div className="relative h-72 bg-gray-200">
                    <div className="absolute top-4 left-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                    <span className="font-medium text-gray-700">{member.id}</span>
                    </div>
                    <div className="w-full h-full flex items-center justify-center">
                    {member.image ? (
                        <Image 
                        src={member.image} 
                        alt={member.name}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="text-gray-400 text-5xl">{member.name.charAt(0)}</div>
                    )}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white rounded-full px-4 py-1 text-sm font-medium shadow-md">
                    {member.name}
                    </div>
                </div>
                
                <div className="p-6">
                    <h3 className="text-xl font-bold ml-2 mb-5">{member.cucode}</h3>
                    <div className="flex items-center mb-3">
                    {member.icon}
                    <h3 className="text-xl font-medium ml-2">{member.role}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{member.description}</p>
                    
                    <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Responsibilities:</h4>
                    <ul className="text-gray-600 space-y-1">
                        {member.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {resp}
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
};

export default AboutUs;