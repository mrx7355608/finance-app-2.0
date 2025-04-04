import { upload } from "cloudinary-react-native";
import { Cloudinary } from "@cloudinary/url-gen";
import { UploadApiResponse } from "cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params";

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUD_NAME,
  },
});

const uploadImage = async (link: string, callback: any) => {
  return upload(cld, {
    file: link,
    options: {
      upload_preset: "finance-app",
      resource_type: "image",
      unsigned: true,
    },
    callback: callback,
  });
};

export const uploadImagesToCloudinary = async (imageURLs: string[]) => {
  const uploadedURLs: string[] = [];
  const callback = (err: unknown, resp: UploadApiResponse) => {
    if (resp?.secure_url) {
      uploadedURLs.push(resp.secure_url);
    }
  };

  await Promise.all(imageURLs.map((link) => uploadImage(link, callback)));
  return uploadedURLs;
};
