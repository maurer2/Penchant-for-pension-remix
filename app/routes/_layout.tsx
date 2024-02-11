import { Outlet } from "@remix-run/react";
import { wrapper } from "./_layout.styles";

export default function Layout() {
  return (
    <article className={wrapper}>
      <h1>Penchant for pension remix</h1>
      <main>
        <Outlet />
      </main>
    </article>
  );
}
