"use client";

import { z } from "zod";
import { createForm } from "./lib";
import Link from "next/link";

export default function Page() {
  const SignInSchema = z.object({
    email: z.string().min(1).email().label("Email").placeholder("joe@mama.com"),
    password: z.string().min(1).label("Password").password(),
    firstName: z.string().optional().label("Name"),
    country: z
      .enum(["es", "us"])
      .select([
        {
          label: "Spain",
          value: "es",
        },
        {
          label: "United States",
          value: "us",
        },
      ])
      .label("Country")
      .defaultValue("es"),
    birthday: z
      .date()
      .label("Birthday")
      .optional()
      .label("Date of birth")
      .defaultValue("1990-12-12"),
    terms: z
      .boolean()
      .optional()
      .label(
        <span>
          You must agree to the{" "}
          <Link className="underline" href="/terms">
            terms and conditions
          </Link>
        </span>
      ),
  });

  const SignInForm = createForm(SignInSchema);

  return (
    <div className="mx-auto mt-4 max-w-md p-6 font-mono">
      <SignInForm
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const data = Object.fromEntries(
            new FormData(e.target as HTMLFormElement)
          );
          window.alert(JSON.stringify(data, null, 2));
        }}
      />
    </div>
  );
}
