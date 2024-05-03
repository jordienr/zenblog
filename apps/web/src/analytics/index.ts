export function sendViewEvent({
  blog_id,
  post_id,
  post_slug,
  post_title,
}: {
  blog_id: string;
  post_id: string;
  post_slug: string;
  post_title: string;
}) {
  fetch("https://api.eu-central-1.aws.tinybird.co/v0/events?name=post_events", {
    method: "POST",
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      blog_id,
      post_id,
      post_slug,
      post_title,
      event_type: "post_view",
    }),
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to send event");
    }
  });
}
