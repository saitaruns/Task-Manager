import React, { useContext } from "react";
import HeaderCard from "./header-card";
import OpinionSVG from "../../public/undraw_opinion.svg";
import PostSVG from "../../public/undraw_posts.svg";
import ShareSVG from "../../public/undraw_share_link.svg";
import Link from "next/link";
import { CircleHelp } from "lucide-react";
import { AuthContext } from "./auth-context";
import useAuth from "@/lib/hooks/useAuth";

const Header: React.FC = () => {
  const user = useAuth();
  const headerCards = [
    {
      title: "Introducing tags",
      description:
        "Easily categorize and find your notes by adding tags. Keep your workspace clutter-free and efficient.",
      image: OpinionSVG,
    },
    {
      title: "Share Notes Instantly",
      description:
        "Effortlessly share your notes with others via email or link. Enhance collaboration with quick sharing options.",
      image: ShareSVG,
    },
    {
      title: "Access Anywhere",
      description:
        "Sync your notes across all devices. Stay productive whether you're on your phone, tablet, or computer.",
      image: PostSVG,
    },
  ];
  return (
    <header className="flex flex-col py-4">
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
      <div className="flex gap-4 mt-4">
        {headerCards.map((card) => (
          <HeaderCard
            key={card.title}
            title={card.title}
            description={card.description}
            image={card.image}
          />
        ))}
      </div>
    </header>
  );
};

export default Header;
