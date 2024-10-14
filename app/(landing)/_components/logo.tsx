import Image from "next/image";

export const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image
        src="/logo.svg"
        height="70"
        width="70"
        alt="Logo"
        className="dark:hidden"
      />
      <Image
        src="/logo-dark.svg"
        height="70"
        width="70"
        alt="Logo"
        className="hidden dark:block"
      />
    </div>
  )
}