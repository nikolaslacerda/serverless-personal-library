import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET

export class AttachmentUtils {
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = s3BucketName
    ) {}

    getAttachmentUrl(bookId: string) {
        return `https://${this.bucketName}.s3.amazonaws.com/${bookId}`
    }

    getUploadUrl(bookId: string): string {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: bookId,
            Expires: parseInt(process.env.SIGNED_URL_EXPIRATION, 10)
        }) as string
    }
}