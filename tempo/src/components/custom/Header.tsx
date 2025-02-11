import React from "react";

import logo from "../../assets/logo.png";

function Header() {
  return (
    <div className="p-2 shadow-sm flex justify-between items-center ">
      <img src={logo} alt="logo" className="w-auto h-12 sm:h-16 md:h-20" />
      {/* <div>
        <Button>Create new trip</Button>
      </div> */}
    </div>
  );
}

export default Header;
