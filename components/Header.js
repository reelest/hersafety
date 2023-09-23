import { useAnnouncementsAPI } from "@/logic/api";
import ThemedButton from "./ThemedButton";
import Link from "next/link";

export default function Header({ showAnnouncements = true }) {
  const data = useAnnouncementsAPI();

  return (
    <header>
      {showAnnouncements ? createHeader(data?.announcements?.[0]) : null}
    </header>
  );
}

const createHeader = (announcement) => {
  switch (announcement) {
    case "admission":
      return (
        <>
          <div className="bg-primaryDark px-8 sm:px-20">
            <div
              className={`container mx-auto flex flex-wrap self-auto py-4 sm:py-8 text-white items-center max-sm:hidden`}
            >
              <div className="font-20 my-2">
                ADMISSIONS ARE ONGOING! Register your kids for the entrance
                exams.
              </div>
              <div className="flex my-2 items-center justify-end flex-grow">
                <Link href="/portal" className="font-24b">
                  Portal
                </Link>
                <span className="border-l-2 border-white h-10 inline-block mx-4" />
                <ThemedButton variant="small">Register</ThemedButton>
              </div>
            </div>
          </div>
          <div className="container sm:hidden mx-auto text-center px-5 font-20 my-2">
            ADMISSIONS ARE ONGOING! Register your kids for the entrance exams.
          </div>
        </>
      );
  }
};
