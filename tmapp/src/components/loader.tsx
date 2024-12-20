import Ripple from "@/components/magicui/ripple";

export function Loader() {
  return (
    <div className="fixed flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <p className="z-10 whitespace-pre-wrap text-center text-4xl font-medium tracking-tighter">
        Loading
      </p>
      <Ripple />
    </div>
  );
}
