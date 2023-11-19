import { fetcher } from "itty-fetcher";
import { FeedbackSchema, getFeedbackOption } from "../types/Feedback";

export default defineEventHandler(async (event) => {
  const { message, page, contact, type } = await readValidatedBody(
    event,
    FeedbackSchema.parseAsync,
  );
  const env = useRuntimeConfig(event);

  if (!["bug", "suggestion", "other", "appreciate"].includes(type!) || !message)
    throw new Error("Invalid input.");

  let description = `${message}\n\n`;
  if (contact) description += `**Contact:** ${contact} • `;
  if (page) description += `**Page:** \`${page}\``;

  await fetcher()
    .post(env.WEBHOOK_URL, {
      username: "Feedback",
      avatar_url: "https://i.kym-cdn.com/entries/icons/facebook/000/043/403/cover3.jpg",
      embeds: [
        {
          color: 3447003,
          title: getFeedbackOption(type).label,
          description,
        },
      ],
    })
    .catch((error) => {
      throw new Error(error);
    });

  return { status: "ok" };
});
