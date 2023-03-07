import { config } from "../../config.js";

export async function threadListFormat(threads) {
  return threads.map((thread) => ({
    threadId: thread.id,
    threadPath: thread.path.replace("/v1/thread/", ""),
    title: thread.value,
    published: 0,
  }));
}

export async function threadFirstPostDiscord(json) {
  const thread = json.data;
  const post = json.data.posts[0]; //firstPost

  let avatar = post.author.avatar;

  //Content Parsing.
  let content = post.content.replaceAll("<br>", "\n");
  content = content.replace(linkRegex, ATagMarkdown);
  content += `\n\n[${post.author.name}](${post.author.link}) / [link](${post.link})`;

  //  thread_id: thread.id,

  const payload = {
    type: 1,
    //
    id: post.id,
    thread_name: thread.title,
    content: content,
  };

  if (config.postAsUser) {
    payload.username = post.author.name;
  }

  if (config.disableEmbeds) {
    payload.flags = "0011111111";
  }

  if (avatar.startsWith("http") && config.postWithAvatar) {
    payload.avatar_url = avatar;
    //! This is buggy, some images results with thread with no original post.
    //! Thread displays "Original message was deleted" and content posted as a comment.
  }

  return payload;
}

//Content Stuff
const linkRegex = /<a[^>]+href=\"(.*?)\"[^>]*>(.*?)<\/a>/gm;
const linkParseRegex =
  /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/gm;
const shorthenLink = (...r) => `${r[3]}/.../${r[r.length - 4]}`;

const ATagMarkdown = (m, link, title) => {
  title = title.includes("http")
    ? title.replace(linkParseRegex, shorthenLink)
    : title;
  return `[${title}](${link})`;
};

// data.embeds = [
//   {
//     thumbnail: {
//       url: avatar,
//       inline: false,
//     },
//   },
// ];
