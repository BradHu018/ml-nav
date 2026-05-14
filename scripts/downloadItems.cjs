const fs = require("fs");
const path = require("path");

const equipment = require("../frontend/src/data/equipment.json");

const outputDir = path.join(process.cwd(), "public", "items");
fs.mkdirSync(outputDir, { recursive: true });

function getDirectImageUrl(url) {
  const match = url.match(/url=([^&]+)/);
  if (!match) return url;

  const decodedPath = decodeURIComponent(match[1]);
  return `https://mlbb.io${decodedPath}`;
}

function getFileName(url) {
  const directUrl = getDirectImageUrl(url);
  return directUrl.split("/").pop().replaceAll("'", "");
}

async function main() {
  const uniqueUrls = new Set();

  for (const hero of equipment) {
    for (const itemUrl of hero.bestBuild) {
      uniqueUrls.add(itemUrl);
    }
  }

  for (const itemUrl of uniqueUrls) {
    const directUrl = getDirectImageUrl(itemUrl);
    const fileName = getFileName(itemUrl);
    const filePath = path.join(outputDir, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${fileName}`);
      continue;
    }

    try {
      const res = await fetch(directUrl);

      if (!res.ok) {
        console.log(`Failed ${fileName}: ${res.status}`);
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      console.log(`Downloaded ${fileName}`);
    } catch (err) {
      console.log(`Error downloading ${fileName}:`, err.message);
    }
  }
}

main();