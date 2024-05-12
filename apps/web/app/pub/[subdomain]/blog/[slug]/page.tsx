import { redirect } from "next/navigation";

export default function Redirect({
  params: { slug },
}: {
  params: { slug: string };
}) {
  redirect("/" + slug);
}
