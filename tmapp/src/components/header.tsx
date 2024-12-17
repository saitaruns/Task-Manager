import React from "react";
import Link from "next/link";
import { CircleHelp } from "lucide-react";
import useAuth from "@/lib/hooks/useAuth";

const Header: React.FC = () => {
  const user = useAuth();
  return (
    <header className="flex flex-col pb-4">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold font-barlow">
          Good morning, {user?.isFetched ? user.data?.name : ""}
        </h1>
        <Link
          className="text-sm flex text-[#080808] font-[400] items-center gap-2"
          href="#"
        >
          Help & Feedback <CircleHelp size={16} className="inline" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
