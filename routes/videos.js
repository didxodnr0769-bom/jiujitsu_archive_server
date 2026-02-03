const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");

// Helper to map DB snake_case to API camelCase
const mapVideo = (video) => ({
  ...video,
  categoryId: video.category_id,
  category_id: undefined, // remove snake_case key
});

/**
 * 비디오 등록
 */
router.post("/", async (req, res) => {
  const { url, title, note, categoryId, type } = req.body;

  try {
    const { data, error } = await supabase
      .from("videos")
      .insert([
        {
          url,
          title,
          type: type || "long", // default to 'long'
          note,
          category_id: categoryId,
        },
      ])
      .select();

    if (error) throw error;

    const newVideo = mapVideo(data[0]);
    res
      .status(201)
      .json({ message: "Video created successfully", video: newVideo });
  } catch (error) {
    console.error("Error creating video:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/** 카테고리 아이디별 비디오 조회 */
router.get("/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const [videosResponse, categoryResponse] = await Promise.all([
      supabase.from("videos").select("*").eq("category_id", categoryId),
      supabase
        .from("categories")
        .select("name")
        .eq("id", categoryId)
        .maybeSingle(),
    ]);

    if (videosResponse.error) throw videosResponse.error;

    const videos = videosResponse.data.map(mapVideo);
    const categoryName = categoryResponse.data
      ? categoryResponse.data.name
      : null;

    console.log("Category ID:", categoryId, "Count:", videos.length);
    res.json({
      message: "Request Success",
      categoryName: categoryName,
      videos: videos,
    });
  } catch (error) {
    console.error("Error fetching videos by category:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/** 전체 비디오 조회 */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("videos").select("*");

    if (error) throw error;

    const videos = data.map(mapVideo);
    res.json({ message: "Request Success", videos: videos });
  } catch (error) {
    console.error("Error fetching all videos:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/** 비디오 수정 */
router.put("/:videoId", async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const { url, title, note, categoryId, type } = req.body;

  const updateData = {};
  if (url) updateData.url = url;
  if (title) updateData.title = title;
  if (note) updateData.note = note;
  if (categoryId) updateData.category_id = categoryId;
  if (type) updateData.type = type;

  try {
    const { data, error } = await supabase
      .from("videos")
      .update(updateData)
      .eq("id", videoId)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json({
      message: "Video updated successfully",
      video: mapVideo(data[0]),
    });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/** 비디오 삭제 */
router.delete("/:id", async (req, res) => {
  const videoId = parseInt(req.params.id);

  try {
    const { error } = await supabase.from("videos").delete().eq("id", videoId);

    if (error) throw error;

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
