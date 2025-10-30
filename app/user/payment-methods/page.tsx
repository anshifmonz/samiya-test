import { generateBaseMetadata } from 'lib/utils/generateMetadata';
import PaymentMethods from 'components/user/payment-methods/PaymentMethods';

export const metadata = generateBaseMetadata({
  title: 'Payment Methods',
  description: 'Manage your saved payment methods for quick and easy checkout.',
  noIndex: true
});

export default function PaymentPage() {
  return <PaymentMethods />;
}
