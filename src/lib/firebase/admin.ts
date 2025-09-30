import admin from 'firebase-admin';

let app: admin.app.App;

if (!admin.apps.length) {
  if (
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
  } else {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serviceAccount = require('../../../serviceAccountKey.json');
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch (e) {
      throw new Error(
        'Firebase Admin SDK initialization failed: missing serviceAccountKey.json or environment variables'
      );
    }
  }
} else {
  app = admin.app();
}

export { app, admin };
