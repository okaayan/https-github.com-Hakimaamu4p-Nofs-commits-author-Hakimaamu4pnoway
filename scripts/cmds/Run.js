const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  config: {
    name: 'run',
    role: 0,
    author: 'HEAvEN🧘‍♀️',
    category: 'Uptime',
    version: '1',
    shortDescription: 'Show the bot running time.',
    longDescription: 'Show the bot running time and see the host server information.',
    guide: {
      en: 'Usage: {p}up'
    }
  },
  onStart: async function ({ api, args, message, event, threadsData }) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const mins = Math.floor((uptime % 3600) / 60);
    const secs = Math.floor(uptime % 60);
    const time = `${hours} hours, ${mins} minutes, ${secs} seconds.`;

    const totalMem = os.totalmem() / 1024 / 1024;
    const freeMem = os.freemem() / 1024 / 1024;
    const usedMem = totalMem - freeMem;
    const memUsagePercent = (usedMem / totalMem) * 100;

    const diskUsage = await getDiskUsage();

    const upol = {
          os: `${os.type()} ${os.release()}`,
          arch: os.arch(),
          cpu: `${os.cpus()[0].model} (${os.cpus().length} cores)`,
    }
    
    const msg = `⏰ Bot Uptime: ${time}\n🖥 Host Server: ${upol.os}\n💾 Host Architecture: ${upol.arch}\n🖥 Host CPU: ${upol.cpu}\n📀 Total Ram: ${totalMem.toFixed(2)} MB\n💽 Ram Usage: ${usedMem.toFixed(2)} MB (${memUsagePercent.toFixed(2)}%)\n💽 Free Ram: ${freeMem.toFixed(2)} MB\n💾 Disk Usage: ${formatBytes(diskUsage.used)} / Total ${formatBytes(diskUsage.total)}`;
    api.sendMessage(msg, event.threadID);
  }
};
async function getDiskUsage() {
  const { stdout } = await exec('df -k /');
  const [_, total, used] = stdout.split('\n')[1].split(/\s+/).filter(Boolean);
  return { total: parseInt(total) * 1024, used: parseInt(used) * 1024 };
}

async function formatBytes(bytes) {
  const UPoL = ['B', 'KB', 'MB', 'GB', 'TB'];
  let AHH = 0;
  while (bytes >= 1024 && AHH < UPoL.length - 1) {
    bytes /= 1024;
    AHH++;
  }
  return `${bytes.toFixed(2)} ${UPoL[AHH]}`;
}
