import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { withAllContexts, withRouter } from "../../tests/utils";
import { Route } from "react-router-dom";
import RelatedVideos from "../RelatedVideos";
import { fakeVideos } from "../../tests/videos";

describe("related videos", () => {
  // 컴포넌트에서 사용하는 url이 1밖에 없으므로 목을 1개 등록ㄴ
  const fakeYoutube = {
    relatedVideos: jest.fn(),
  };

  // 테스트가 끝날때마다 mock을 리셋
  afterEach(() => fakeYoutube.relatedVideos.mockReset());

  it("renders correctly", async () => {
    fakeYoutube.relatedVideos.mockImplementation(() => fakeVideos);
    const { asFragment } = renderRelatedVideos();

    // 로딩을 기다리고
    await waitForElementToBeRemoved(screen.queryByText("Loading..."));

    // 스냅샷 생성
    expect(asFragment()).toMatchSnapshot();
  });

  it("완벽한 비디오 랜더링 테스트", async () => {
    fakeYoutube.relatedVideos.mockImplementation(() => fakeVideos);
    renderRelatedVideos();

    expect(fakeYoutube.relatedVideos).toHaveBeenCalledWith("id");
    await waitFor(() =>
      // 리스트아이템이 총 비디오의 길이와 같은지?
      expect(screen.getAllByRole("listitem")).toHaveLength(fakeVideos.length)
    );
  });

  it("데이터가 없을 경우 로딩이 나오는지", () => {
    fakeYoutube.relatedVideos.mockImplementation(() => fakeVideos);
    renderRelatedVideos();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("에러 메세지가 잘 나오는지", async () => {
    fakeYoutube.relatedVideos.mockImplementation(() => {
      throw new Error("error");
    });

    renderRelatedVideos();
    await waitFor(() => {
      expect(screen.getByText("Something is wrong 😖")).toBeInTheDocument();
    });
  });

  function renderRelatedVideos() {
    return render(
      withAllContexts(
        withRouter(<Route path="/" element=<RelatedVideos id={"id"} /> />),
        fakeYoutube
      )
    );
  }
});
