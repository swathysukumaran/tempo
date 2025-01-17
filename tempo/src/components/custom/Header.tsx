import React from "react";
import { Button } from "../ui/button";

function Header() {
  return (
    <div className="p-2 shadow-sm flex justify-between items-center ">
      <img src="/logo.svg" alt="logo" />
      <div>
        <Button>Sign in</Button>
      </div>
    </div>
  );
}

export default Header;
