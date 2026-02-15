import * as admin from 'firebase-admin';

export function getFirebaseMessaging() {
    if (!admin.apps.length) {
        try {
            console.log('Firebase Admin Init - Project ID:', process.env.FIREBASE_PROJECT_ID);

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
            throw error; // Re-throw to handle in caller
        }
    }
    return admin.messaging();
}
