import Image from "next/image";

export const Heroes = () => {
  return (
        <div className="flex items-center justify-center">
          <Image
            src="/desktop.png"
            alt="laptop"
            loading="lazy"
            width="1000"
            height="500"
          />
        </div>
  )
}