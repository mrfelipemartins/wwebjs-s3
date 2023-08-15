# WhatsAppWeb.js AWS S3 Remote Auth Strategy

[![npm version](https://img.shields.io/npm/v/wwebjs-s3.svg)](https://www.npmjs.com/package/wwebjs-s3)
[![License](https://img.shields.io/npm/l/wwebjs-s3.svg)](https://github.com/mrfelipemartins/wwebjs-s3/blob/main/LICENSE)

🚀 **WhatsAppWeb.js AWS S3 Remote Auth Strategy** is a custom authentication strategy for WhatsAppWeb.js, allowing you to use AWS S3 for remote authentication.

## Installation

Install the strategy using npm:

```bash
npm install wwebjs-s3
```

## Usage

To use this AWS S3 remote auth strategy with WhatsAppWeb.js, follow these steps:

1. Install the strategy package as shown above.
2. Set up your AWS credentials using environment variables or configuration.
3. Import and configure the strategy in your WhatsAppWeb.js app.
4. Implement your custom authentication logic in your app.
5. Here's an example of how to set up the strategy:

```javascipt
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { S3Store } = require('wwebjs-s3');

const credentials = {
  region: 'your-s3-region',
  accessKeyId: 'your-s3-access-key-id',
  secretAccessKey: 'your-s3-secret-access-key',
  bucket: 'your-bucket-name'
}

const store = new S3Store(credentials)

const client = new Client({
    authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 300000
    })
});

client.initialize();
```