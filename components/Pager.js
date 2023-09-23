import ArrowLeftIcon from "@heroicons/react/20/solid/ArrowLeftIcon";
import ArrowRightIcon from "@heroicons/react/20/solid/ArrowRightIcon";
import TextButton from "./TextButton";

function Pager({
  controller: { page, hasNext, goto, hasPrev, goNext, goPrev, numPages },
}) {
  const pages = [
    !hasNext && page - 2 > 0 && page - 2,
    hasPrev && page - 1,
    page,
    hasNext && page + 1,
    !hasPrev && page + 2 <= numPages && page + 2,
  ].filter(Boolean);
  while (pages.length < Math.min(numPages, 3)) pages.push("");
  return (
    <div className="bg-transparentGray rounded-full px-4 py-2 flex items-center">
      <TextButton className="group mr-4" onClick={goPrev} disabled={!hasPrev}>
        <ArrowLeftIcon
          className="text-accent1 group-disabled:text-disabled inline mx-1"
          width={20}
        />
        Prev
      </TextButton>
      {pages.map((e) => (
        <button
          key={e}
          onClick={() => goto(e)}
          className={`w-6 font-20 h-6 flex items-center justify-center rounded-full mx-1 ${
            e === page ? "bg-accent1 text-white" : ""
          }`}
        >
          {e || ""}
        </button>
      ))}
      <TextButton className="ml-4 group" onClick={goNext} disabled={!hasNext}>
        Next
        <ArrowRightIcon
          className="text-accent1 group-disabled:text-disabled inline mx-1"
          width={20}
        />
      </TextButton>
    </div>
  );
}
export default Pager;
