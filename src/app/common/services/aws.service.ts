import { createPresignedPost, PresignedPostOptions } from "@aws-sdk/s3-presigned-post";
import { S3Client, PutObjectCommand }  from "@aws-sdk/client-s3";
import { PresignedPost } from "aws-sdk/clients/s3";
// ...
const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!!,
    },
    region: "us-east-1",
});


export const generatePresignedUrl=async (userId: number)=>{
    const options: PresignedPostOptions = {
        Bucket: "dapp-ctr",
        Key: `/images/${userId}/${Math.random()}/image.jpg`,
        Conditions: [
            ['content-length-range', 0, 5*1024*1024]
        ],
        Expires: 3600
        
    };
    const {url, fields} = await createPresignedPost(client, options);
    return {url, fields};

}