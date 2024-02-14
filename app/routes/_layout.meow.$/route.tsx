import { Link } from "@remix-run/react";

export default function Meow() {
  return (
    <div>
      <h1>Meow</h1>
      <ul>
        <li>Matches <Link to='/meow'>/meow</Link></li>
        <li>Matches <Link to='/meow/'>/meow/</Link></li>
        <li>Matches <Link to='/meow/test'>/meow/test</Link></li>
        <li>Matches <Link to='/meow/test/test'>/meow/test/test</Link></li>
      </ul>
    </div>
  );
}
