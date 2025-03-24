import Image from "next/image";

export default function Introduction() {
  return (
    <div className="relative flex items-center justify-between h-full pt-10 pb-10">
      <div className="z-10 p-10 text-white w-1/2 space-y-6">
        <p className="text-[#4F3622] text-xl">The perfect meal awaits you</p>
        <p className="text-[#4F3622] text-5xl">Make a reservation and explore a world of flavor</p>
      </div>
      <div className="z-10 w-1/2">
        <Image
          src="/img/introduce/intro-bg-image.png"
          alt="Delicious meal"
          layout="intrinsic"
          width={500}
          height={500}
          className="object-cover"
        />
      </div>
    </div>
  );
}
