import { S3Client, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import { awsConfig } from "../config/aws-config";

const s3Client = new S3Client({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
  },
});

const BUCKET_NAME = awsConfig.bucketName;

export const uploadFile = async (file: File) => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET_NAME,
      Key: file.name,
      Body: file,
    },
  });

  await upload.done();
};

export const getFile = async (key: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };
  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  console.log('url ==============>', url);
  return url;
};

export const deleteFile = async (key: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };
  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);
};

export const listFiles = async () => {
  const params = {
    Bucket: BUCKET_NAME,
  };
  const command = new ListObjectsV2Command(params);
  const response = await s3Client.send(command);
  return response.Contents;
};
