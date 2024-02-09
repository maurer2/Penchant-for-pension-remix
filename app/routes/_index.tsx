import type { MetaFunction , ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, Form, useActionData, redirect } from "@remix-run/react";
import { z } from "zod";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
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
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <h1>Test</h1>
      <dl>
        <dt>desiredPension</dt>
        <dd>{desiredPension}</dd>
        <dt>personalContribution</dt>
        <dd>{personalContribution}</dd>
        <dt>employerContribution</dt>
        <dd>{employerContribution}</dd>
        <dt>retirementAge</dt>
        <dd>{retirementAge}</dd>
      </dl>
      <button type="button" onClick={updatePage}>
        Update
      </button>
      <hr />
      <Form method="post">
        <label style={{ display: "block" }}>desiredPension
          <input type="text" name="desiredPension" defaultValue={desiredPension} />
        </label>
        <label style={{ display: "block" }}>personalContribution
          <input type="text" name="personalContribution" defaultValue={personalContribution} />
        </label>
        <label style={{ display: "block" }}>employerContribution
          <input type="text" name="employerContribution" defaultValue={employerContribution} />
        </label>
        <label style={{ display: "block" }}>desiredPension
          <input type="text" name="retirementAge" defaultValue={retirementAge} />
        </label>
        <button type="submit">
          Submit
        </button>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(actionData, null, 4)}
        </pre>
      </Form>
    </div>
  );
}
