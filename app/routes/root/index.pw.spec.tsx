import { createRemixStub } from "@remix-run/testing";

import { expect, test } from '@playwright/experimental-ct-react';

import IndexPage from '../_layout._index';

test.describe('IndexPage', () => {
  const RemixStub = createRemixStub([
    {
      id: 'index',
      path: "/*",
      Component: IndexPage,
      // Component() {
      //   return (
      //     <>
      //       <h1>Update</h1>
      //     </>
      //   );
      // },
      loader: () => ({
        desiredPension: '1',
        personalContribution: '2',
        employerContribution: '3',
        retirementAge: '4'
      })
    },
  ]);

  test('renders', async ({ mount }) => {
    const component = await mount(<RemixStub />);
    await expect(component).not.toBeEmpty();
  });
});