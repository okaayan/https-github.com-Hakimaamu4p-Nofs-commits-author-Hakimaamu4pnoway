const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "video", 
    version: "1.0",
    author: "Team Calyx",
    countDown: 120,
    role: 0,
    category: "𝗠𝗘𝗗𝗜𝗔", 
  },
  onStart: async ({ message, args }) => {
    try {
      const searchTerm = args.join(" ");
      if (!searchTerm) return message.reply("Please enter video name or YouTube link.");

      let firstVideoUrl = searchTerm; 

      if (!firstVideoUrl.includes("youtube.com") && !firstVideoUrl.includes("youtu.be")) {
        const searchResults = await yts(searchTerm);
        if (!searchResults.videos.length) return message.reply("No videos found.");
        firstVideoUrl = searchResults.videos[0].url;
      }

      const downloaderApiUrl = `http://45.90.12.34:5047/video?url=${firstVideoUrl}`;
      const downloadResponse = await axios.get(downloaderApiUrl);
      const downloadUrl = downloadResponse.data.public_url;

      const fileName = `${searchTerm.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.mp4`;
      const filePath = path.join(__dirname, "tmp", fileName);
      
      await downloadFile(downloadUrl, filePath);
      const videoMessage = await message.reply({ 
        attachment: fs.createReadStream(filePath)
      });
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while processing your request.");
    }
  }
};

async function downloadFile(url, path) {
  const writer = fs.createWriteStream(path);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
