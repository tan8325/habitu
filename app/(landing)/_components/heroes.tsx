import Image from "next/image";

export const Heroes = () => {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/desktop-light.png"
        alt="laptop"
        loading="lazy"
        width="1000"
        height="500"
        className="hidden dark:block"
      />
      <Image
        src="/desktop-dark.png"
        alt="laptop dark"
        loading="lazy"
        width="1000"
        height="500"
        className="block dark:hidden"
      />
    </div>
  );
};
