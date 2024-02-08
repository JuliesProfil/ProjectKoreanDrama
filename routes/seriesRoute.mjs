import express, { response } from "express";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import Series from "../modules/series.mjs";


const SERIES_API = express.Router();
SERIES_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.


SERIES_API.get("/:id", Series.listAll);






export default SERIES_API;
