import { css } from "../../../styled-system/css";

export const wrapper = css({
  maxWidth: "1200px",
  padding: "2rem",
  margin: "auto",
});

export const grid = css({
  display: "grid",
  gap: "2rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
});

export const title = css({
  fontSize: "2rem",
  marginBottom: "1rem",
});

export const button = css({
  padding: "0.5rem 1rem",
  border: "1px solid black",
  cursor: "pointer",
});

export const input = css({
  padding: "0.5rem 1rem",
  border: "1px solid black",
  borderRadius: 0,
});

export const subgrid = css({
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "min-content minmax(0, 1fr)",
});

export const subgridBreak = css({
  gridColumn: "1/-1",
});

export const list = css({
  marginBottom: "1rem",
});

export const code = css({
  whiteSpace: "pre-wrap",
});
