import type { Metadata } from 'next';

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string[];
  canonical?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  schema?: Record<string, any>;
}

const BASE_URL = 'https://www.samiyaonline.com';
const DEFAULT_IMAGE = `${BASE_URL}/opengraph-image.png`;
const SITE_NAME = 'Samiya Online';
const TWITTER_HANDLE = '@samiya_online';

export function generateBaseMetadata({
  title = SITE_NAME,
  description = 'Discover elegant abayas, gowns, sarees, and more at Samiya Online. Shop premium quality fashion for every occasion.',
  image = DEFAULT_IMAGE,
  url = BASE_URL,
  type = 'website',
  keywords = ['fashion', 'abaya', 'gown', 'saree', 'party wear', 'shopping', 'Samiya Online'],
  canonical = url,
  publishedTime,
  modifiedTime,
  noIndex = false,
  schema
}: GenerateMetadataOptions = {}): Metadata {
  const jsonLd = schema ? { 'application/ld+json': JSON.stringify(schema) } : undefined;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical,
      languages: { 'en-IN': canonical }
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: 'en_IN',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title,
      description,
      images: [image]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1
          }
        },
    authors: [{ name: SITE_NAME, url: BASE_URL }],
    publisher: SITE_NAME,
    category: 'Shopping',
    themeColor: '#000000',
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png'
    },
    manifest: '/manifest.webmanifest',
    ...(jsonLd ? { other: jsonLd } : {}),
    ...(publishedTime || modifiedTime
      ? {
          openGraph: {
            ...({
              publishedTime,
              modifiedTime
            } as any)
          }
        }
      : {})
  };
}
