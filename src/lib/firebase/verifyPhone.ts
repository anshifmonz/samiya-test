import { admin } from 'lib/firebase/admin';

export const verifyPhone = async (token: string, phone: string) => {
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const expected = `+91${phone.replace(/^(\+91)?/, '')}`;
    return decoded.phone_number === expected;
  } catch (_) {
    return false;
  }
};
