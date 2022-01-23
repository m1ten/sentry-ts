import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import fs from "fs";

export const data = new SlashCommandBuilder()
  .setName("reddit")
  .setDescription("get a post from a subreddit!")
  .addStringOption((option) =>
    option
      .setName("subreddit")
      .setDescription("subreddit name")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option.setName("ephemeral").setDescription("Show or hide message")
  );

export async function execute(interaction: any) {
  let subreddit = interaction.options.getString("subreddit").toLowerCase();
  const ephemeral = interaction.options.getBoolean("ephemeral");

  if (subreddit.includes("r/")) {
    subreddit = subreddit.replace("r/", "");
  }

  try {
    let nsfwSubreddits = fs.readFileSync("nsfw.txt", "utf8").toLowerCase();

    if (nsfwSubreddits.includes(subreddit)) {
      throw ":warning: NSFW subreddits are not allowed.";
    }
  } catch (e) {
    console.log("Error: ", e);
    throw ":warning: An error occurred while fetching subreddit data.";
  }

  // get member from executor
  const member = interaction.member;

  // get image from api
  const response = await fetch(
    `https://www.reddit.com/r/${subreddit}/random.json?obey_over18=true`
  );
  const json = await response.json();

  let childrenData;

  try {
    childrenData = json[0].data.children[0].data;
  } catch {
    //console.log(e);
    try {
      childrenData = json.data.children[Math.floor(Math.random() * 15)].data;
    } catch {
      //console.log(e);
      throw `:warning: r/${subreddit} does not exist.`;
    }
  }

  // convert utc in ms to real time
  let date = new Date(childrenData.created * 1000).toUTCString();

  let embed;
  if (childrenData.domain === "i.redd.it") {
    embed = new MessageEmbed()
      .setTitle(`${childrenData.title}`)
      .setURL(`https://reddit.com${childrenData.permalink}`)
      .addField("Media", `${childrenData.url}`)
      .setAuthor({ name: `${childrenData.subreddit}` })
      .setImage(`${childrenData.url}`)
      .setColor("#FF5700")
      .setDescription(`${childrenData.selftext}`)
      .setFooter({ text: `${date}` });
  } else {
    embed = new MessageEmbed()
      .setTitle(`${childrenData.title}`)
      .setURL(`https://reddit.com${childrenData.permalink}`)
      .addField("Media", `${childrenData.url}`)
      .setAuthor({ name: `${childrenData.subreddit}` })
      .setColor("#FF5700")
      .setDescription(`${childrenData.selftext}`)
      .setFooter({ text: `Powered by Reddit - ${date}` });
  }

  // send message
  await interaction
    .reply({
      embeds: [embed],
      ephemeral: ephemeral,
    })
    .catch(() => {
      throw ":warning: An error occurred while replying.";
    });
}
