import React from "react";
import PublicNavbar from "@/components/PublicNavbar";
import ContactCard from "@/components/Contact";

export default function ContactPage() {
  return (
    <>
      <PublicNavbar />
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "120px" }}>
        <ContactCard />
      </div>
    </>
  );
}