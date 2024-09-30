

require('dotenv').config();
const { S3Client, PutObjectCommand, GetObjectCommand,ListObjectsV2Command, HeadBucketCommand, CreateBucketCommand } = require("@aws-sdk/client-s3");
const { Readable } = require('stream');
const stream = require('stream');
const { contentTypes } = require('../../utils/contentTypes');
const path = require('path');
const mime = require('mime-types');

const bucketName = process.env.AWS_BUCKET_NAME;


function createS3Client() {
    const isLocal = process.env.AWS_LOCAL == 'true';
  
    if (isLocal) {
      return new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
      });
    } else {
      return new S3Client({
        region: 'ap-southeast-1',
        // No need to specify endpoint unless you have a specific requirement
      });
    }
  }

const s3Client = createS3Client();

function getContentTypeFromExtension(filename) {
    const ext = path.extname(filename).toLowerCase();
    return contentTypes[ext.substring(1)] || 'application/octet-stream';
}


async function uploadToS3(key, body) {

    // const contentType = getContentTypeFromExtension(key);
    const contentType = mime.lookup(key) || 'application/octet-stream';

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType
    });

    try {
        await s3Client.send(command);
        console.log(`File uploaded successfully: ${key}`);
    } catch (error) {
        console.error("Error uploading file to S3:", error);
    }
}


async function fetchFromS3(key) {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key
    });

    try {
        const response = await s3Client.send(command);
        if (!response.Body) {
            throw new Error("Body is undefined");
        }
        return response.Body instanceof Readable ? streamToBuffer(response.Body) : response.Body;
    } catch (error) {
        console.error("Error fetching file from S3:", error);
        throw error;
    }
}

function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', (chunk) => chunks.push(chunk));
        readableStream.on('end', () => resolve(Buffer.concat(chunks)));
        readableStream.on('error', reject);
    });
}

async function listFilesInS3Folder(folderKey) {
    const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: folderKey
    });

    try {
        const response = await s3Client.send(command);
        const files = response.Contents.map(item => item.Key);
        return files;
    } catch (error) {
        console.error("Error listing files in S3 folder:", error);
        throw error;
    }
}

module.exports = { uploadToS3, fetchFromS3, listFilesInS3Folder};