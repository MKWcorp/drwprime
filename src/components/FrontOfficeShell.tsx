'use client';

import { ReactNode } from "react";
import MobileHeader from "./MobileHeader";
import MobileBottomNavFO from "./MobileBottomNavFO";
import Navbar from "./Navbar";

export default function FrontOfficeShell({ children }: { children: ReactNode }) {
  return (
    <>
      <MobileHeader />
      <Navbar />
      <div className="pt-14 lg:pt-0 pb-20 lg:pb-0">
        {children}
      </div>
      <MobileBottomNavFO />
    </>
  );
}
