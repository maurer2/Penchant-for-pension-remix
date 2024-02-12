import type { MetaFunction , ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, Form, useActionData, redirect } from "@remix-run/react";
import { z } from "zod";
import { json } from "@remix-run/node";
import { grid, button, input, subgrid, subgridBreak, list } from "./_layout.styles";
import { cx } from 'styled-system/css'

export const meta: MetaFunction = () => {
  return [
    { title: "Penchant for pension remix" },
    { name: "description", content: "Remix test" },
  ];
};

type RootLoaderProps = {
  request: Request;
};

type QueryParamsSchema = z.infer<typeof queryParamsSchema>;

const queryParamsSchema = z.object({
  desiredPension: z.string().catch("1"),
  personalContribution: z.string().catch("2"),
  employerContribution: z.string().catch("3"),
  retirementAge: z.string().catch("4"),
});

const formFieldSchema = z.object({
  desiredPension: z.string().min(1).pipe(z.coerce.number().int().nonnegative()),
  personalContribution: z.string().min(1).pipe(z.coerce.number().int().nonnegative()),
  employerContribution: z.string().min(1).pipe(z.coerce.number().int().nonnegative()),
  retirementAge: z.string().min(1).pipe(z.coerce.number().int().positive()),
});

// runs on the server
export async function loader({ request }: RootLoaderProps) {
  const queryParamsStringified = Object.fromEntries(
    new URL(request.url).searchParams
  );

  try {
    const queryParams: QueryParamsSchema = queryParamsSchema.parse(
      queryParamsStringified
    );
    return json(queryParams);
  } catch (error) {
    console.log(error);
  }
}

// runs on the server
export async function action({ request }: ActionFunctionArgs) {
  const payload = await request.formData();
  const formData = Object.fromEntries(payload);

  const parserResult = formFieldSchema.safeParse(formData);
  if (!parserResult.success) {
    return parserResult.error.flatten();
  }

  const newUrlParams = new URLSearchParams({
    desiredPension: parserResult.data.desiredPension.toString(),
    personalContribution: parserResult.data.personalContribution.toString(),
    employerContribution: parserResult.data.employerContribution.toString(),
    retirementAge: parserResult.data.retirementAge.toString(),
  });

  // 30x status code
  return redirect(`/?${newUrlParams.toString()}`);
}

// ?desiredPension=1&personalContribution=2&employerContribution=3&retirementAge=4
export default function Index() {
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
      search: `?${urlParams}`,
    });
  }

  return (
    <div className={grid}>
      <section>
        <dl className={cx(subgrid, list)}>
          <dt>desiredPension</dt>
          <dd>{desiredPension}</dd>
          <dt>personalContribution</dt>
          <dd>{personalContribution}</dd>
          <dt>employerContribution</dt>
          <dd>{employerContribution}</dd>
          <dt>retirementAge</dt>
          <dd>{retirementAge}</dd>
        </dl>
        <button type="button" onClick={updatePage} className={button}>
          Update
        </button>
      </section>
      <section>
        <Form method="post" className={subgrid}>
          <label htmlFor="desiredPension">desiredPension</label>
          <input type="text" name="desiredPension" id="desiredPension" defaultValue={desiredPension} className={input} />

          <label htmlFor="personalContribution">personalContribution</label>
          <input type="text" name="personalContribution" id="personalContribution" defaultValue={personalContribution} className={input} />

          <label htmlFor="employerContribution">employerContribution</label>
          <input type="text" name="employerContribution" id="employerContribution" defaultValue={employerContribution} className={input} />

          <label htmlFor="retirementAge">desiredPension</label>
          <input type="text" name="retirementAge" id="retirementAge" defaultValue={retirementAge} className={input} />

          <button type="submit" className={button}>
            Submit
          </button>

          <pre style={{ whiteSpace: "pre-wrap" }} className={subgridBreak}>
            {JSON.stringify(actionData, null, 4)}
          </pre>
        </Form>
      </section>
    </div>
  );
}
