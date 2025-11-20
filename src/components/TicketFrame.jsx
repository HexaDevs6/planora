import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const TicketFrame = ({ children }) => {
  return (
    <Card
      className="
    relative 
    overflow-hidden 
    rounded-2xl 
    border-2 
    shadow-lg 
    max-w-[280px] 
    mx-auto 
    pb-6
    bg-[var(--card)]
    text-[var(--card-foreground)]
  "
    >
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full border" />
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full border" />

      <CardContent className="pt-6 px-6">{children}</CardContent>
    </Card>
  );
};

export default TicketFrame;
