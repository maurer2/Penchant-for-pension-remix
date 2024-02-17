import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRemixStub } from "@remix-run/testing";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import userEvent from "@testing-library/user-event";

import IndexPage, { loader } from "../_layout._index";
import * as layoutComponent from "../_layout._index";

type LoaderReturnType = ReturnType<typeof useLoaderData<typeof loader>>;
// type ActionReturnType = Awaited<ReturnType<typeof action>>;

describe("IndexPage", () => {
  const loaderReturnData: LoaderReturnType = {
    desiredPension: "5",
    personalContribution: "6",
    employerContribution: "7",
    retirementAge: "8",
  };

  const renderWithRemixStub = (
    loaderData: LoaderReturnType = loaderReturnData,
    actionFunction = layoutComponent.action,
    path = "/"
  ) => {
    const Component = createRemixStub([
      {
        path,
        Component: IndexPage,
        loader() {
          return json(loaderData);
        },
        action: actionFunction, // use real action
      },
    ]);

    return {
      user: userEvent.setup(),
      ...render(<Component />),
    };
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

  it("should redirect to new route after successful submit", async () => {
    const actionSpy = vi.spyOn(layoutComponent, "action");
    const { user } = renderWithRemixStub();

    expect(await screen.findByTestId("debug-section")).toBeInTheDocument();

    expect(
      await screen.getByLabelText("desiredPension", { selector: "input" })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /Submit/i })
    ).toBeInTheDocument();

    await user.type(
      await screen.getByLabelText("desiredPension", { selector: "input" }),
      "500"
    );

    await user.click(await screen.findByRole("button", { name: /Submit/i }));
    screen.debug();

    expect(actionSpy).toHaveBeenCalled();

    // todo check new route
  });
});
