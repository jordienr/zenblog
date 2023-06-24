import Spinner from "@/components/Spinner";
import { createAPIClient } from "@/lib/app/api";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";

export default function Welcome() {
  // Checks invitations for user
  // If user has invitations, add them to the blog
  const api = createAPIClient();
  const router = useRouter();
  const { isLoading } = useQuery("userSetup", () => api.user.setup());

  return (
    <div className="flex-center my-56">
      <div className="flex flex-col gap-4">
        {isLoading && (
          <div className="flex">
            <Spinner />
          </div>
        )}
        <h1 className="text-3xl">Welcome</h1>
        {isLoading && (
          <p className="max-w-xs text-slate-700">
            We're setting up your workspace.
            <br /> Please give us a second...
          </p>
        )}
        {!isLoading && <p>Everything's ready, let's go.</p>}
        {!isLoading && (
          <button
            onClick={() => router.push("/blogs")}
            className="btn btn-primary"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
