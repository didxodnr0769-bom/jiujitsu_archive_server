const express = require("express");
const router = express.Router();

// Mock data for initial state
const initialVideos = [
  {
    id: 1,
    url: "https://www.youtube.com/watch?v=iBnSYYFOLRo",
    title: "[주짓수기술] 초보자라면 꼭 알아야 되는 하프가드 패스 3가지",
    type: "long",
    note: "주짓수 하프가드 패스 강의 영상입니다",
    categoryId: 1,
  },
  {
    id: 2,
    url: "https://www.youtube.com/watch?v=xAPM4lZnrpI",
    title:
      "하프가드탈출,플랫하드가드탈출,하프가드스윕,주짓수초보개념,주짓수기초",
    type: "long",
    note: "주짓수 하프가드 패스 강의 영상입니다",
    categoryId: 1,
  },
  {
    id: 3,
    url: "https://www.youtube.com/watch?v=xAPM4lZnrpI",
    title:
      "하프가드탈출,플랫하드가드탈출,하프가드스윕,주짓수초보개념,주짓수기초",
    type: "long",
    note: "주짓수 하프가드 패스 강의 영상입니다",
    categoryId: 2,
  },
];

// Video CRUD API

/**
 * 비디오 등록
 * 필요 데이터
 * - title
 * - note
 * - url
 * - categoryId
 */
router.post("/", (req, res) => {
  const { url, title, note, categoryId } = req.body;

  const newVideoId =
    initialVideos.length > 0
      ? Math.max(...initialVideos.map((video) => video.id)) + 1
      : 1;

  const newVideo = {
    id: newVideoId,
    url,
    title,
    type: "long", // type은 long으로 고정
    note,
    categoryId,
  };

  initialVideos.push(newVideo);

  res
    .status(201)
    .json({ message: "Video created successfully", video: newVideo });
});

/** 카테고리 아이디별 비디오 조회 */
router.get("/:categoryId", (req, res) => {
  const categoryId = req.params.categoryId;
  const videos = initialVideos.filter(
    (video) => video.categoryId === parseInt(categoryId)
  );

  console.log("Category ID:", categoryId, videos);
  res.json({ message: "Request Success", videos: videos });
});

/** 전체 비디오 조회 */
router.get("/", (req, res) => {
  res.json({ message: "Request Success", videos: initialVideos });
});

/** 비디오 수정 */
router.put("/:videoId", (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const { url, title, note, categoryId } = req.body;

  const videoIndex = initialVideos.findIndex((video) => video.id === videoId);

  if (videoIndex === -1) {
    return res.status(404).json({ message: "Video not found" });
  }

  initialVideos[videoIndex] = {
    ...initialVideos[videoIndex],
    url: url || initialVideos[videoIndex].url,
    title: title || initialVideos[videoIndex].title,
    note: note || initialVideos[videoIndex].note,
    categoryId: categoryId || initialVideos[videoIndex].categoryId,
  };

  res.json({
    message: "Video updated successfully",
    video: initialVideos[videoIndex],
  });
});

/** 비디오 삭제 */
router.delete("/:id", (req, res) => {
  const videoId = parseInt(req.params.id);
  const videoIndex = initialVideos.findIndex((video) => video.id === videoId);

  if (videoIndex === -1) {
    return res.status(404).json({ message: "Video not found" });
  }

  initialVideos.splice(videoIndex, 1);

  res.json({ message: "Video deleted successfully" });
});

module.exports = router;
