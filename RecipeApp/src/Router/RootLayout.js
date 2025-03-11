import React from "react";
import { Outlet } from "react-router-dom";
import Menu from "../Common/Menu/Menu";
import Loader from "../Common/Loader/Loader";
import { useLoading } from "../Common/Loader/LoadingContext";

function RootLayout() {
    const {loading} = useLoading();
    console.log("Loading : ", loading);
  return (
    <div>
    {/*    <div className="Loading"> {loading && <Loader /> }</div>*/}
      <Loader />

      <Menu /> {/* Menu affiché sur toutes les pages */}
      <Outlet /> {/* Zone où les pages enfants seront chargées */}
    </div>
  );
}

export default RootLayout;
