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
      const json = JSON.parse(data);
      const seen = new Set();
      const unique = json.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });

      fs.writeFileSync("backup.json", JSON.stringify(unique, null, 2), "utf8");
      console.log("✅ Backup saved:", unique.length);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err);
    }
  });
}).on("error", err => {
  console.error("❌ Request Error:", err);
});
