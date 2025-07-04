const fs = require("fs");
const https = require("https");

const url = "https://ironcoder.site/ironmyid/getall.php";

https.get(url, res => {
  let data = "";

  res.on("data", chunk => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      if (res.statusCode !== 200) {
        throw new Error("Server returned status code: " + res.statusCode);
      }

      const json = JSON.parse(data);
      const records = json.data; // ✅ "data" array ထဲကတင်လုပ်မယ်

      if (!Array.isArray(records)) {
        throw new Error("API returned non-array data");
      }

      const seen = new Set();
      const unique = records.filter(item => {
        if (!item.id) return false;
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });

      fs.writeFileSync("backup.json", JSON.stringify(unique, null, 2), "utf8");
      console.log(`✅ Backup complete. Total unique items: ${unique.length}`);
    } catch (err) {
      console.error("❌ Error:", err.message);
      process.exit(1);
    }
  });
}).on("error", err => {
  console.error("❌ Request error:", err.message);
  process.exit(1);
});
