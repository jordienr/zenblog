import AppLayout from "@/layouts/AppLayout";
import React from "react";

type Props = {};

const index = (props: Props) => {
  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-xl font-medium">Account settings</h1>
        <section className="my-4 rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-medium">Subscription details</h2>
        </section>
      </div>
    </AppLayout>
  );
};

export default index;
