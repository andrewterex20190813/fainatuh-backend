import dotenv from "dotenv";
import path from "path";

const root = path.join.bind(this, __dirname, "../../");
dotenv.config({ path: root(".env") });

const s3BucketName = process.env.AWS_S3_BUCKET;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;

export default {
s3BucketName,
awsAccessKey,
awsSecretKey
};
