import express from "express";

import {handleRedirects} from "../controllers/url.js";


const router = express.Router();

router.get("/:shortId",handleRedirects);

export default router;