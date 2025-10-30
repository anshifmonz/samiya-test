import Home from 'components/home';
import getSectionsWithProducts from 'lib/public/section';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const revalidate = 180;

export const metadata = generateBaseMetadata({
  title: 'Samiya Online - Elegant Wedding & Party Dresses',
  description:
    "Discover exquisite wedding attire and traditional wear crafted for life's most precious moments. Elegant bridal collection, sherwanis, kurtis, salwar suits, and festive wear."
});

export default async function HomePage() {
  const specials = await getSectionsWithProducts();

  return <Home specials={specials} />;
}
