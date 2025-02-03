import Footer from "@/components/Footer";
import Navigation from "@/components/marketing/Navigation";
import React, { PropsWithChildren } from "react";

type Props = {};

const layout = (props: PropsWithChildren<Props>) => {
  return (
    <>
      <div className="mx-auto min-h-screen bg-white">
        <Navigation />
        <div className="mx-auto max-w-5xl ">
          {props.children}
          <div className="h-24"></div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default layout;
