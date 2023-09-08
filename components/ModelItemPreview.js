import usePromise from "@/utils/usePromise";
import { Avatar, Box, Typography } from "@mui/material";
import Image from "next/image";

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
export default function ModelItemPreview({ item }) {
  /**@type {import("../models/lib/model").Model}*/
  const { title, description, image, avatar } =
    usePromise(
      () =>
        (
          item.model().Meta[MODEL_ITEM_PREVIEW] ||
          ((item) => ({ title: item.uniqueName() }))
        )(item),
      [item]
    ) ?? {};
  return (
    <Box sx={{ width: "20rem", maxWidth: "100%" }}>
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
    </Box>
  );
}
