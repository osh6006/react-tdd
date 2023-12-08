import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react";

import { Route } from "react-router-dom";

import SearchHeader from "../SearchHeader";

import { withRouter } from "../../tests/utils";
import userEvent from "@testing-library/user-event";

describe("SearchHeader", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      withRouter(<Route path="/" element={<SearchHeader />}></Route>, "/bts")
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it("renders with keword correctly", () => {
    render(
      withRouter(<Route path="/:keyword" element={<SearchHeader />} />, "/bts")
    );
    expect(screen.getByDisplayValue("bts")).toBeInTheDocument();
  });

  it("navigators to results page on search button click", () => {
    const searchKeyword = "fake-keyword";

    render(
      withRouter(
        <>
          <Route path={"/home"} element={<SearchHeader />} />
          <Route
            path={`/videos/${searchKeyword}`}
            element={<p>{`Search result for ${searchKeyword}`}</p>}
          />
        </>,
        "/home"
      )
    );

    const searchButton = screen.getByRole("button");
    const searchInput = screen.getByRole("textbox");

    userEvent.type(searchInput, searchKeyword);
    userEvent.click(searchButton);

    expect(
      screen.getByText(`Search result for ${searchKeyword}`)
    ).toBeInTheDocument();
  });
});
