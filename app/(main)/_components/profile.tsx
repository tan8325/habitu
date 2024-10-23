import { UserButton } from "@clerk/clerk-react";

export const Profile = () => {
  return (
    <>
      <div className="flex items-center hover:bg-primary/5">
      <UserButton
        appearance={{
          elements: {
            userButtonBox: {
              flexDirection: "row-reverse",
              justifyContent: "flex-end",
              width: "200px",
              height: "50px",
              marginLeft: "10px",
            },
          },
        }}
        showName
      />
      </div>
    </>
  );
};