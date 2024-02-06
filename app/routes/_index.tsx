import type { MetaFunction } from "@remix-run/node";
import { useSearchParams, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { json } from "@remix-run/node"; // or cloudflare/deno

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type RootLoaderProps = {
  request: Request;
};

const queryParamsSchema = z.object({
  desiredPension: z.string().catch("1"),
  personalContribution: z.string().catch("2"),
  employerContribution: z.string().catch("3"),
  retirementAge: z.string().catch("4"),
});

type QueryParamsSchema = z.infer<typeof queryParamsSchema>;

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

// ?desiredPension=1&personalContribution=2&employerContribution=3&retirementAge=4
export default function Index() {
  // const [searchParams, setSearchParams] = useSearchParams();

  const {
    desiredPension,
    personalContribution,
    employerContribution,
    retirementAge,
  } = useLoaderData<typeof loader>();

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
    </div>
  );
}
