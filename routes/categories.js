const express = require("express");
const router = express.Router();

// 카테고리 목록 조회
router.get("/", (req, res) => {
  const categories = [
    { categoryId: 1, name: "스로우 매치기" },
    { categoryId: 2, name: "더블렉 테이크다운" },
    { categoryId: 3, name: "싱글렉 테이크다운" },
    { categoryId: 4, name: "가드에서 스윕" },
    { categoryId: 5, name: "가드 패스" },
    { categoryId: 6, name: "하프가드 스윕" },
    { categoryId: 7, name: "하프가드 패스" },
  ];
  res.json({
    message: "Get all categories",
    result: { categories: categories },
  });
});

// 카테고리 등록
router.post("/", (req, res) => {
  res.json({ message: "Create a new category" });
});

router.put("/:id", (req, res) => {
  res.json({ message: `Update category with id ${req.params.id}` });
});
router.delete("/:id", (req, res) => {
  res.json({ message: `Delete category with id ${req.params.id}` });
});

module.exports = router;
