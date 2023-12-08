import { Route } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";

import ChannelInfo from "../ChannelInfo";

import { withAllContexts, withRouter } from "../../tests/utils";

describe("channel Info", () => {
  const fakeYoutube = {
    channelImageURL: jest.fn(),
  };

  afterEach(() => fakeYoutube.channelImageURL.mockReset());

  it("renders correctly", async () => {
    const { asFragment } = renderChannelInfoWithCallback(() => "url");

    await waitFor(() => screen.findByText("channel"));
    await waitFor(() => screen.findByRole("img"));
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders without img correctly", async () => {
    renderChannelInfoWithCallback(() => {
      throw new Error("error");
    });

    expect(screen.queryByRole("img")).toBeNull();
  });

  function renderChannelInfoWithCallback(callback) {
    fakeYoutube.channelImageURL.mockImplementation(callback);
    return render(
      withAllContexts(
        withRouter(
          <Route path="/" element={<ChannelInfo id="id" name="channel" />} />
        ),
        fakeYoutube
      )
    );
  }
});
