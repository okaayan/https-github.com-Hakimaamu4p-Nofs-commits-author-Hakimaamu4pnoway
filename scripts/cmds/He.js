module.exports = {
 config: {
 name: "hello",
 version: "1.0",
 author: "HEAvEN",
 countDown: 5,
 role: 0,
 shortDescription: "no prefix",
 longDescription: "no prefix",
 category: "no prefix",
 }, 
 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "beluga") {
 return message.reply({
 body: "pusa na naman tangina ka meow🐱",
 attachment: await global.utils.getStreamFromURL("https://i.imgur.com/5ZMQzkl.jpg")
 });
 }
 }
}
