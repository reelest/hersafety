import LoaderAnimation from "./LoaderAnimation";

export default function FullscreenLoader() {
  return (
    <div className="fixed font-24b text-primaryLight flex-col bg-black bg-opacity-10 inset-0 h-screen flex justify-center items-center">
      <LoaderAnimation className="w-12 my-10" />
      &nbsp;Please wait...
    </div>
  );
}
