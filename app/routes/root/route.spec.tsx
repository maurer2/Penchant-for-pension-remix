import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRemixStub } from "@remix-run/testing";
import { json } from "@remix-run/node";
import { useLoaderData, redirect } from "@remix-run/react";
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

  it("should call action upon submit", async () => {
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

    expect(actionSpy).toHaveBeenCalled();
  });

  it("should redirect to the same url with updated query params upon successful submit", async () => {
    const { user } = renderWithRemixStub();

    expect(await screen.findByTestId("debug-section")).toBeInTheDocument();

    expect(await screen.findByRole("form")).toBeInTheDocument();
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

    // formData that is used for submit
    const formData = new FormData(screen.getByRole("form") as HTMLFormElement);
    // query params of redirect to update current query params
    // https://github.com/microsoft/TypeScript/issues/30584#issuecomment-1865354582
    const newQueryParams = new URLSearchParams(
      formData as unknown as Record<string, string>
    );

    // https://sergiodxa.com/tutorials/test-remix-loaders-and-actions
    const targetRequest = new Request("http://localhost", {
      method: "POST",
      body: formData,
    });

    const actionResponse = await layoutComponent.action({
      request: targetRequest,
      params: {},
      context: {},
    });
    expect(actionResponse).toEqual(redirect(`/?${newQueryParams}`));
  });

  it.todo("should return error upon invalid submit", async () => {
  });
});
