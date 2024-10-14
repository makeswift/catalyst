import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { Breadcrumbs } from '~/components/breadcrumbs';
import { LocaleType } from '~/i18n/routing';

import { Description } from './_components/description';
import { Details } from './_components/details';
import { Gallery } from './_components/gallery';
import { ProductViewed } from './_components/product-viewed';
import { RelatedProducts } from './_components/related-products';
import { Reviews } from './_components/reviews';
import { Warranty } from './_components/warranty';
import { getProduct } from './page-data';
import { client } from '~/lib/makeswift/client';
import { ACCORDION_COMPONENT_TYPE } from '~/components/ui/accordions/accordion.makeswift';
import { Unstable_MakeswiftComponent } from '@makeswift/runtime/next';
import { MakeswiftProvider } from '~/lib/makeswift/provider';
import { draftMode } from 'next/headers';
import { MAKESWIFT_PRODUCT_DETAIL_TYPE } from '~/components/ui/makeswift-product-detail/makeswift-product-detail.makeswift';

interface Props {
  params: { slug: string; locale: LocaleType };
  searchParams: Record<string, string | string[] | undefined>;
}

function getOptionValueIds({ searchParams }: { searchParams: Props['searchParams'] }) {
  const { slug, ...options } = searchParams;

  return Object.keys(options)
    .map((option) => ({
      optionEntityId: Number(option),
      valueEntityId: Number(searchParams[option]),
    }))
    .filter(
      (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
    );
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const productId = Number(params.slug);
  const optionValueIds = getOptionValueIds({ searchParams });

  const product = await getProduct({
    entityId: productId,
    optionValueIds,
    useDefaultOptionSelections: optionValueIds.length === 0 ? true : undefined,
  });

  if (!product) {
    return {};
  }

  const { pageTitle, metaDescription, metaKeywords } = product.seo;
  const { url, altText: alt } = product.defaultImage || {};

  return {
    title: pageTitle || product.name,
    description: metaDescription || `${product.plainTextDescription.slice(0, 150)}...`,
    keywords: metaKeywords ? metaKeywords.split(',') : null,
    openGraph: url
      ? {
          images: [
            {
              url,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function Product({ params: { locale, slug }, searchParams }: Props) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations('Product');

  const productId = Number(slug);

  const optionValueIds = getOptionValueIds({ searchParams });

  const product = await getProduct({
    entityId: productId,
    optionValueIds,
    useDefaultOptionSelections: optionValueIds.length === 0 ? true : undefined,
  });

  if (!product) {
    return notFound();
  }

  const category = removeEdgesAndNodes(product.categories).at(0);
  const productDetailSnapshot = await client.unstable_getComponentSnapshot({
    key: slug,
    type: MAKESWIFT_PRODUCT_DETAIL_TYPE,
    siteVersion: 'Working',
  });
  const accordionSnapshot = await client.unstable_getComponentSnapshot({
    key: slug,
    type: ACCORDION_COMPONENT_TYPE,
    siteVersion: 'Working',
  });

  return (
    <MakeswiftProvider previewMode={draftMode().isEnabled}>
      {category && <Breadcrumbs category={category} />}

      <div className="mb-12 mt-4 lg:grid lg:grid-cols-2 lg:gap-8">
        <Gallery product={product} />
        <Details
          product={product}
          info={<Unstable_MakeswiftComponent snapshot={productDetailSnapshot} />}
        />
        <div className="lg:col-span-2">
          <Description product={product} />
          <Warranty product={product} />
          <Suspense fallback={t('loading')}>
            <Reviews productId={product.entityId} />
          </Suspense>

          <Unstable_MakeswiftComponent snapshot={accordionSnapshot} />
        </div>
      </div>

      <Suspense fallback={t('loading')}>
        <RelatedProducts productId={product.entityId} />
      </Suspense>

      <ProductViewed product={product} />
    </MakeswiftProvider>
  );
}

export const runtime = 'nodejs';
