/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import React, { useEffect } from "react";

type Props = {};

const Index = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.push(`/blogs`);
  }, []);

  return <div></div>;
};

export default Index;
