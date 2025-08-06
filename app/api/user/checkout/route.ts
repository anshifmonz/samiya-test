import { GET as handleGET } from './get';
import { POST as handlePOST } from './create';

export async function GET() {
  return handleGET();
}

export async function POST() {
  return handlePOST();
}
