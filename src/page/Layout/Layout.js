import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";

const Layout = ({ loginStatus, handleLoginStatus }) => {
  return (
    <>
      <NavBar loginStatus={loginStatus} handleLoginStatus={handleLoginStatus} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
