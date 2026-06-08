import { BUCKETS, storage } from "../appwrite/config";

const IMAGE_URL_FIELDS = [
  "imageUrl",
  "image_url",
  "imageURL",
  "imagenUrl",
  "imagen_url",
  "photoUrl",
  "pictureUrl",
];

const IMAGE_FILE_FIELDS = [
  "image",
  "imagen",
  "imageId",
  "image_id",
  "imagenId",
  "imagen_id",
  "imageFileId",
  "fileId",
  "storageFileId",
];

const IMAGE_BUCKET_FIELDS = [
  "bucketId",
  "bucket_id",
  "imageBucketId",
  "storageBucketId",
];

function normalizeValue(value) {
  if (Array.isArray(value)) {
    return normalizeValue(value[0]);
  }

  if (value && typeof value === "object") {
    return (
      value.$id ||
      value.fileId ||
      value.imageId ||
      value.id ||
      value.url ||
      value.href ||
      ""
    );
  }

  return value || "";
}

function getFirstValue(item, fields) {
  for (const field of fields) {
    const value = normalizeValue(item[field]);

    if (value) {
      return value;
    }
  }

  return "";
}

function getStorageImageUrl(bucketId, fileId) {
  return storage.getFilePreview({
    bucketId,
    fileId,
    width: 700,
    height: 520,
    quality: 85,
  });
}

function getImageFromAppwriteUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const storagePathMatch = parsedUrl.pathname.match(
      /\/storage\/buckets\/([^/]+)\/files\/([^/]+)/
    );

    if (!storagePathMatch) {
      return "";
    }

    const [, bucketId, fileId] = storagePathMatch;

    return getStorageImageUrl(bucketId, fileId);
  } catch {
    return "";
  }
}

export function getItemImageUrl(item, fallbackBucketId = "") {
  const imageValue = getFirstValue(item, IMAGE_URL_FIELDS);

  if (typeof imageValue === "string" && imageValue.startsWith("http")) {
    return getImageFromAppwriteUrl(imageValue) || imageValue;
  }

  const fileId = imageValue || getFirstValue(item, IMAGE_FILE_FIELDS);
  const bucketId =
    fallbackBucketId ||
    getFirstValue(item, IMAGE_BUCKET_FIELDS) ||
    BUCKETS.products;

  if (!fileId || !bucketId) {
    return "";
  }

  return getStorageImageUrl(bucketId, fileId);
}
