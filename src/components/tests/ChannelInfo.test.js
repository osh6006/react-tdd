import { Route } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";

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

  // 어느정도 반복되는 것은 가독성이 좋기 때문에 너무 줄여서도 안된다~
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
