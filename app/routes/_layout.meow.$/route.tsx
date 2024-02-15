import { Link } from "@remix-run/react";

export default function MeowPage() {
  return (
    <div>
      <h2>Meow</h2>
      <ul>
        <li>Matches <Link to='/meow'>/meow</Link></li>
        <li>Matches <Link to='/meow/'>/meow/</Link></li>
        <li>Matches <Link to='/meow/test'>/meow/test</Link></li>
        <li>Matches <Link to='/meow/test/test'>/meow/test/test</Link></li>
      </ul>
    </div>
  );
}
