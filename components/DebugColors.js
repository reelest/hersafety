import { colors, ColorFilters } from "@/components/colors";

export default function DebugColors() {
  return (
    <div className=" flex flex-wrap bg-white relative z-20">
      {Object.keys(ColorFilters).map((e, i, a) => (
        <div
          key={e}
          className={`w-32 h-32 m-2 flex flex-col items-center justify-center`}
          style={{ background: colors[e] }}
        >
          <span className={"text-" + a[(i + (i % 2 ? -1 : 1)) % a.length]}>
            {e}
          </span>
          <div className="flex w-16 h-8 mt-2">
            <div
              className="bg-black  w-8 h-8"
              style={{ filter: ColorFilters[e] }}
            />
            <div className="bg-black  w-8 h-8" />
          </div>
          <div className="flex w-16 h-8">
            <div className="bg-white  w-8 h-8" />
            <div
              className="bg-black  w-8 h-8"
              style={{ filter: ColorFilters[e] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
