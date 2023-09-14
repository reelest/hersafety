import usePromise from "@/utils/usePromise";
import { Avatar, Box, Typography } from "@mui/material";
import Image from "next/image";
import { Item } from "../models/lib/model";
import Template from "./Template";
import { ItemDoesNotExist } from "@/models/lib/errors";

/**
 * @typedef {{
 *    title: string,
 *    description: string,
 *    image: string,
 *    avatar: string
 * }} PreviewInit
 */
export const MODEL_ITEM_PREVIEW = "!model-item-preview";
/**
 *
 * @param {Object} props
 * @param {import("../models/lib/model").Item} props.item
 */
export default function ModelItemPreview({ item, ...props }) {
  /**@type {import("../models/lib/model").Model}*/
  const { title, description, image, avatar } =
    usePromise(async () => {
      if (item instanceof Item) {
        if (item.model().Meta[MODEL_ITEM_PREVIEW]) {
          if (!item._isLoaded) await item.load();
          return item.model().Meta[MODEL_ITEM_PREVIEW](item);
        } else return { title: item.uniqueName() };
      } else return { title: String(item) };
    }, [item]) ?? {};
  return (
    <Template as={Box} props={props}>
      {image ? (
        <Box
          as={Image}
          src={image}
          alt=""
          width={720}
          sx={{
            minHeight: "8rem",
            width: "100%",
            height: "auto",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      ) : null}
      <Box sx={{ width: "100%", display: "flex" }}>
        {avatar ? (
          <Box>
            <Avatar alt="" src={avatar} />
          </Box>
        ) : null}
        <Box>
          <Typography variant="body1">{title}</Typography>
          <Typography variant="body2">{description}</Typography>
        </Box>
      </Box>
    </Template>
  );
}
