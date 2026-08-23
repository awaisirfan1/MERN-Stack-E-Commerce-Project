import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  addAddress,
  deleteAddress,
  getAllAddress,
  getSinleAddress,
} from "../controller/Address.js";

const router = express.Router();

router.post("/address/new", isAuth, addAddress);
router.get("/address/all", isAuth, getAllAddress);
router.get("/address/:id", isAuth, getSinleAddress);
router.delete("/address/:id", isAuth, deleteAddress);

export default router;
