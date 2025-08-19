import { apiRequest } from 'utils/apiRequest';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL!;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD!;

export async function getShiprocketToken() {
  const { data, error, response } = await apiRequest(`${SR_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD },
    retry: true
  });
  if (error || (response && !response.ok)) return false;
  if (!data?.token) return false;
  return data.token;
}
