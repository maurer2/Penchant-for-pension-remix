import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRemixStub } from "@remix-run/testing";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import IndexPage, { loader } from "../_layout._index";

type LoaderReturnType = ReturnType<typeof useLoaderData<typeof loader>>;

describe("IndexPage", () => {
  const loaderReturnData: LoaderReturnType = {
    desiredPension: "5",
    personalContribution: "6",
    employerContribution: "7",
    retirementAge: "8",
  };

  const renderWithRemixStub = (
    loaderData: LoaderReturnType = loaderReturnData,
    path = "/"
  ) => {
    const Component = createRemixStub([
      {
        path,
        Component: IndexPage,
        loader() {
          return json(loaderData);
        },
        // action() {
        // },
      },
    ]);

    return render(<Component />);
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render with default data", async () => {
    renderWithRemixStub();

    expect(await screen.findByTestId("debug-section")).toBeInTheDocument();
    expect(await screen.findByTestId("form-section")).toBeInTheDocument();
  });

  it("should render with custom data", async () => {
    renderWithRemixStub({
      desiredPension: "1",
      personalContribution: "2",
      employerContribution: "3",
      retirementAge: "4",
    });

    expect(
      await screen.findByRole("definition", { name: "desiredPension" })
    ).toHaveTextContent("1");
    expect(
      await screen.findByRole("definition", { name: "personalContribution" })
    ).toHaveTextContent("2");
    expect(
      await screen.findByRole("definition", { name: "employerContribution" })
    ).toHaveTextContent("3");
    expect(
      await screen.findByRole("definition", { name: "retirementAge" })
    ).toHaveTextContent("4");
  });
});
