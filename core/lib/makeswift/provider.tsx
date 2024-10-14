'use client';

import { ReactRuntimeProvider, RootStyleRegistry } from '@makeswift/runtime/next';

import { runtime } from '~/lib/makeswift/runtime';
import '~/lib/makeswift/components';

export function MakeswiftProvider({
  children,
  locale = undefined,
  previewMode = false,
}: {
  children: React.ReactNode;
  locale?: string;
  previewMode: boolean;
}) {
  return (
    <ReactRuntimeProvider runtime={runtime} previewMode={previewMode} locale={locale}>
      <RootStyleRegistry>{children}</RootStyleRegistry>
    </ReactRuntimeProvider>
  );
}
