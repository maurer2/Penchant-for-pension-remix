import type { MetaFunction , ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, Form, useActionData, redirect } from "@remix-run/react";
import { json } from "@remix-run/node";
// import userEvent from '@testing-library/user-event';

import { grid, button, input, subgrid, subgridBreak, list, code } from "./root/styles";
import { cx } from '../../styled-system/css';
import { queryParamsSchema, formFieldSchema, type QueryParamsSchema } from "./root/schemas";

type RootLoaderProps = {
  request: Request;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Penchant for pension remix" },
    { name: "description", content: "Remix test" },
  ];
};

// runs on the server
export function loader({ request }: RootLoaderProps) {
  const queryParamsStringified = Object.fromEntries(new URL(request.url).searchParams);

  try {
    const queryParams: QueryParamsSchema = queryParamsSchema.parse(queryParamsStringified);
    return json(queryParams);
  } catch (error) {
    console.log(error);
  }
}

// runs on the server
export async function action({ request }: ActionFunctionArgs) {
  const payload = await request.formData();
  const formData = Object.fromEntries(payload);

  const parseResult = formFieldSchema.safeParse(formData);
  if (!parseResult.success) {
    return parseResult.error.flatten();
  }

  const newUrlParams = new URLSearchParams({
    desiredPension: parseResult.data.desiredPension.toString(),
    personalContribution: parseResult.data.personalContribution.toString(),
    employerContribution: parseResult.data.employerContribution.toString(),
    retirementAge: parseResult.data.retirementAge.toString(),
  });

  // 30x redirect after successful submit
  return redirect(`/?${newUrlParams.toString()}`);
}

// ?desiredPension=1&personalContribution=2&employerContribution=3&retirementAge=4
export default function IndexPage() {
  const navigate = useNavigate();
  const {
    desiredPension,
    personalContribution,
    employerContribution,
    retirementAge,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  // triggers loader rerun on server
  function updatePage() {
    const urlParams = new URLSearchParams({
      desiredPension: Math.trunc(Math.random() * 10).toString(),
      personalContribution: Math.trunc(Math.random() * 10).toString(),
      employerContribution: Math.trunc(Math.random() * 10).toString(),
      retirementAge: Math.trunc(Math.random() * 10).toString(),
    });

    navigate({
      search: urlParams.toString(),
    });
  }

  return (
    <div className={grid}>
      <section data-testid="debug-section">
        <dl className={cx(subgrid, list)} role="list">
          <dt id="desiredPension-item">desiredPension</dt>
          <dd aria-labelledby="desiredPension-item">{desiredPension}</dd>

          <dt id="personalContribution-item">personalContribution</dt>
          <dd aria-labelledby="personalContribution-item">{personalContribution}</dd>

          <dt id="employerContribution-item">employerContribution</dt>
          <dd aria-labelledby="employerContribution-item">{employerContribution}</dd>

          <dt id="retirementAge-item">retirementAge</dt>
          <dd aria-labelledby="retirementAge-item">{retirementAge}</dd>
        </dl>

        <button type="button" onClick={updatePage} className={button}>
          Update
        </button>
      </section>
      <section data-testid="form-section">
        <Form method="post" className={subgrid} name="form">
          <label htmlFor="desiredPension">desiredPension</label>
          <input type="text" name="desiredPension" id="desiredPension" defaultValue={desiredPension} className={input} />

          <label htmlFor="personalContribution">personalContribution</label>
          <input type="text" name="personalContribution" id="personalContribution" defaultValue={personalContribution} className={input} />

          <label htmlFor="employerContribution">employerContribution</label>
          <input type="text" name="employerContribution" id="employerContribution" defaultValue={employerContribution} className={input} />

          <label htmlFor="retirementAge">retirementAge</label>
          <input type="text" name="retirementAge" id="retirementAge" defaultValue={retirementAge} className={input} />

          <button type="submit" className={button}>
            Submit
          </button>

          <output className={subgridBreak}>
            <pre className={code}>
              {JSON.stringify(actionData, null, 4)}
            </pre>
          </output>
        </Form>
      </section>
    </div>
  );
}
