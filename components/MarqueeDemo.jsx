"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "../components/ui/marquee";

const reviews = [
  {
    name: "Sarah P.",
    username: "@SP",
    body:
      "Video consultations saved me time. I could get advice without taking off work or traveling.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Dr. Robert M.",
    username: "@DR",
    body:
      "This platform helps me reach more patients and provide timely care remotely.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "James T.",
    username: "@JT",
    body:
      "The credit system is convenient. My family can consult with specialists anytime.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Amanda L.",
    username: "@AL",
    body:
      "Booking appointments is easier. I can see my preferred doctor whenever needed.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Michael K.",
    username: "@MK",
    body:
      "Secure video consultations give me confidence in getting proper medical advice from home.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "Emily H.",
    username: "@EH",
    body:
      "The platform keeps track of my medical records. It's organized and accessible anytime.",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Dr. Daniel C.",
    username: "@DC",
    body:
      "I can efficiently monitor patients remotely, focusing more on treatment than logistics.",
    img: "https://avatar.vercel.sh/janet",
  },
  {
    name: "Linda P.",
    username: "@LP",
    body:
      "I recommended this platform to my family. It's simple, reliable, and approachable.",
    img: "https://avatar.vercel.sh/jacob",
  },
];

const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/10 bg-gray-950/1 hover:bg-gray-950/5",
        "dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15"
      )}
    >
      <div className="flex items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt={name} src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-white">{name}</figcaption>
          <p className="text-xs font-medium text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-white/80">{body}</blockquote>
    </figure>
  );
};

export default function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </Marquee>

      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/60 bg-linear-to-r from-background/30"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/60 bg-linear-to-l from-background/30"></div>
    </div>
  );
}
