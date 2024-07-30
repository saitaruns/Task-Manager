import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

const HeaderCard = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => {
  return (
    <Card className="p-4 border border-[#F4F4F4] shadow-none">
      <div className="flex gap-2">
        <Image src={image} alt="Tasks" width={80} height={100} />
        <div className="flex flex-col">
          <h3 className="font-semibold text-[#757575]">{title}</h3>
          <p className="text-[#868686] text-sm font-[400]">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default HeaderCard;
