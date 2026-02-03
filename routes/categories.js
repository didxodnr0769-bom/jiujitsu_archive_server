const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");

// 카테고리 목록 조회
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("id", { ascending: true });

    if (error) throw error;

    const categories = data.map((cat) => ({
      categoryId: cat.id,
      name: cat.name,
    }));

    res.json({
      message: "Get all categories",
      result: { categories: categories },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// 카테고리 등록
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: "Create a new category",
      result: data[0],
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const { data, error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: `Update category with id ${id}`, result: data[0] });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;

    res.json({ message: `Delete category with id ${id}` });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
