/* eslint-disable react-hooks/exhaustive-deps */
import AppLayout from "@/layouts/AppLayout";
import React from "react";

type Props = {};

const Index = (props: Props) => {
  return (
    <AppLayout title="Overview">
      <div>1. Publish your first Post 2. Integrate into your app</div>
    </AppLayout>
  );
};

export default Index;
