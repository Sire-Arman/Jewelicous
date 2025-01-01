import xlsx from "xlsx";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const excelFilePath = join(__dirname, "../assets/Pincodes.xlsx");

const workbook = xlsx.readFile(excelFilePath);

const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const jsonData = xlsx.utils.sheet_to_json(worksheet);

const outputFilePath = join(__dirname, "./pincodes.json");

fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));

