const admin = require('firebase-admin');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

if (!admin.apps.length) {
    try {
        console.log('Initializing Firebase Admin...');
        console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
        console.log('Firebase Admin Initialized Successfully');
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
        process.exit(1);
    }
}

async function main() {
    const tokens = await prisma.deviceToken.findMany();
    if (tokens.length === 0) {
        console.log('No tokens to test.');
        return;
    }

    // Use the most recent token
    const token = tokens[tokens.length - 1].token;
    console.log('Testing token:', token);

    const message = {
        notification: {
            title: 'Test Notification',
            body: 'This is a test message to debug push notifications.',
        },
        token: token,
    };

    try {
        console.log('Sending message...');
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.log('Error sending message:', error);
        if (error.code) console.log('Error Code:', error.code);
    }
}

main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
