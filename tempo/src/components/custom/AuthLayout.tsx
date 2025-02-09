import React from "react";
import { Outlet } from "react-router-dom";
import registerImage from "../assets/register.jpeg";
function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block lg:w-1/2 ">
        <img
          src={registerImage}
          alt="A man relaxing on a beach"
          className="object-cover w-full h-full opacity-90" // opacity helps blend with bg
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="text-center justify-center items-center mb-8">
          {/* Simple musical wave logo */}
          <img src="/logo.svg" alt="logo" className="mx-auto" />
          <h1 className="text-h2 font-bold text-gray-700 mb-2">Tempo</h1>
          <p className="text-body text-gray-600">
            Enjoyour journey, your rhythm
          </p>
          <p className="text-small text-gray-500">
            Create personalized travel experiences that match your pace
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
