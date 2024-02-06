import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// ?desiredPension=1&personalContribution=2&employerContribution=3&retirementAge=4
export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();

  const desiredPension = searchParams.get('desiredPension');
  const personalContribution = searchParams.get('personalContribution');
  const employerContribution = searchParams.get('employerContribution');
  const retirementAge = searchParams.get('retirementAge');

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
