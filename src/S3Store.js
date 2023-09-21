
const { S3Client, ListObjectsCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { createReadStream, createWriteStream } = require("fs");

class S3Store {
    constructor(credentials) {
        if(
            !credentials.hasOwnProperty('region') ||
            !credentials.hasOwnProperty('accessKeyId') ||
            !credentials.hasOwnProperty('secretAccessKey') ||
            !credentials.hasOwnProperty('bucket')
        ) throw new Error('Credentials must have region, accessKeyId, secretAccessKey and bucket')

        this.credentials = credentials;
        this.client = new S3Client({
            forcePathStyle: credentials.forcePathStyle || false,
            endpoint: credentials.endpoint || undefined,
            region: credentials.region,
            credentials: {
                accessKeyId: credentials.accessKeyId,
                secretAccessKey: credentials.secretAccessKey,
            }
        })
    }

    async sessionExists(options) {
        let sessionDir = `session-${options.session}`
        try {
            const command = new ListObjectsCommand({
                Bucket: this.credentials.bucket,
                Prefix: sessionDir,
                MaxKeys: 1
            })

            const data = await this.client.send(command);
            
            const objects = data.Contents || []

            if(objects.length > 0) return true
        } catch (error) {
            throw new Error(error)
        }
    }

    async save(options) {
        let sessionDir = `session-${options.session}`
        try {
            const stream = createReadStream(`${options.session}.zip`)

            const key = `${sessionDir}/${options.session}.zip`;

            const command = new PutObjectCommand({
                Bucket: this.credentials.bucket,
                Key: key,
                Body: stream
            })

            await this.client.send(command)

        } catch (error) {
            throw new Error(error)
        }
    }

    async extract(options) {
        let sessionDir = `session-${options.session}`

        const key = `${sessionDir}/${options.session}.zip`;

        const command = new GetObjectCommand({
            Bucket: this.credentials.bucket,
            Key: key
        })

        const response = await this.client.send(command)

        const stream = response.Body

        const writeStream = createWriteStream(options.path)

        stream.pipe(writeStream)

       return new Promise((resolve, reject) => {
            writeStream.on('finish', resolve)
            writeStream.on('error', reject)
        })
    }

    async delete(options) {
        try {
            let sessionDir = `session-${options.session}`

            const key = `${sessionDir}/${options.session}.zip`;

            const command = new DeleteObjectCommand({
                Bucket: this.credentials.bucket,
                Key: key
            })

            await this.client.send(command)
        } catch(error) {
            throw new Error(error)
        }
    }
}

module.exports = S3Store;