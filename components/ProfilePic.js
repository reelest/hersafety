import Image from "next/image";
import { useUser } from "@/logic/auth";

export function ProfilePic() {
  const user = useUser();
  return (
    <Image
      placeholder="empty"
      src={user?.photoURL}
      width={56}
      height={56}
      alt="user photo"
      className="inline-block rounded-full h-14 w-14 object-cover bg-slate-400"
    />
  );
}
