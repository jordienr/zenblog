export function sendViewEvent({
  blog_id,
  post_slug,
}: {
  blog_id: string;
  post_slug: string;
}) {
  if (!blog_id || !post_slug) {
    console.error("Missing blog_id or post_slug");
    return;
  }
  fetch("https://api.eu-central-1.aws.tinybird.co/v0/events?name=post_views", {
    method: "POST",
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      blog_id,
      post_slug,
      event_type: "post_view",
    }),
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to send event");
    }
    console.log("Event sent");
  });
}

export async function getPostViews({ blog_id }: { blog_id: string }) {
  let url = new URL(
    `https://api.eu-central-1.aws.tinybird.co/v0/pipes/posts.json?blog_id=${blog_id}`
  );

  const result = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
    },
  })
    .then((r) => r.json())
    .then((r) => r)
    .catch((e) => e.toString());

  if (!result.data) {
    console.log(result);
    console.error(`there was a problem running the query: ${result}`);
  } else {
    return result.data;
  }
}
