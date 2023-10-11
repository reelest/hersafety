import ImageKit from "imagekit";
const imagekit = new ImageKit({
  publicKey: "",
  privateKey: "",
  urlEndpoint: "",
});
export const uploadAndGetUrl = async (url, fileName = url.split("/").pop()) => {
  try {
    const result = await imagekit.upload({
      file: url,
      fileName: fileName,
    });
    return result.url;
  } catch (e) {
    console.log(e.stack);
    throw e;
  }
};
