import messagebird from 'messagebird';

const API_KEY = process.env.MESSAGEBIRD_API_KEY;
if (!API_KEY) throw new Error('Missing MESSAGEBIRD_API_KEY in environment variables');
const mbClient = messagebird.initClient(API_KEY);
export default mbClient;
