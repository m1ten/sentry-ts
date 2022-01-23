import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";

export const data = new SlashCommandBuilder()
  .setName("wiki")
  .setDescription("get a wiki page!")
  .addStringOption((option) =>
    option.setName("page").setDescription("page name")
  )
  .addBooleanOption((option) =>
    option.setName("ephemeral").setDescription("Show or hide message")
  );

export async function execute(interaction: any) {
  const ephemeral = interaction.options.getBoolean("ephemeral");
  const page = interaction.options.getString("page");

  // get a random fact from wikipedia
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json`
  );

  const json = await response.json();

  let title: string;

  if (page !== undefined) {
    title = page;
  } else {
    title = json.query.random[0].title;
  }

  let url = `https://en.wikipedia.org/wiki/${title}`;

  // create a well formed url
  url = url.replace(/ /g, "%20");
  url = url.replace(/_/g, "%5F");

  console.log(url);

  // get first paragraph of the page
  const response2 = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=&explaintext=&titles=${title}&format=json`
  );

  const json2 = await response2.json();

  let extract = json2.query.pages[Object.keys(json2.query.pages)[0]].extract;

  // check if extract is undefined
  if (extract === undefined) {
    throw `:warning: ${title} does not exist.`;
  }

  // remove html tags
  extract = extract.replace(/<(?:.|\n)*?>/gm, "");

  // remove newlines
  extract = extract.replace(/\n/g, " ");

  // remove multiple spaces
  extract = extract.replace(/\s\s+/g, " ");

  // remove trailing spaces
  extract = extract.trim();

  // get image from wikipedia
  const response3 = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=250`
  );

  const json3 = await response3.json();

  let image: string;

  try {
    image =
      json3.query.pages[Object.keys(json3.query.pages)[0]].thumbnail.source;
  } catch {
    image = "";
  }

  let embed = new MessageEmbed()
    .setTitle(title)
    .setURL(url)
    .setDescription(extract)
    .setColor("#636466")
    .setFooter({
      text: "Powered by Wikipedia",
    });

  if (image !== "") {
    embed.setImage(image);
  }

  // send image
  await interaction
    .reply({
      embeds: [embed],
      ephemeral: ephemeral,
    })
    .catch((e: any) => {
      console.log(e);
      throw ":warning: An error occurred while replying.";
    });
}
