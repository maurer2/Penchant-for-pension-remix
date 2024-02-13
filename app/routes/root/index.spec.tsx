// import type { ComponentPropsWithoutRef } from 'react';

import { expect, test } from '@playwright/experimental-ct-react';
// import { beforeMount } from '@playwright/experimental-ct-react/hooks';

import IndexPage from './_layout._index';

test.describe('IndexPage', () => {
  // const propsDefault: ComponentPropsWithoutRef<typeof IndexPage> = {};

  test('renders', async ({ mount }) => {
    const component = await mount(<IndexPage />);

    await expect(component).toContainText('Pension calculator');
  });
});