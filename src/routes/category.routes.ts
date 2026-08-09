import { Router } from "express";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../services/category/category.controller.js";

const router = Router();

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;