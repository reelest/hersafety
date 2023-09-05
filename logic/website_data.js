import { WebsiteDataModel } from "@/models/website_data";
import usePromise from "@/utils/usePromise";

/**
 *
 * @returns {import("../models/website_data").WebsiteData}
 */
export default function useWebsiteData() {
  return usePromise(() => WebsiteDataModel.getOrCreate("only"), []);
}
