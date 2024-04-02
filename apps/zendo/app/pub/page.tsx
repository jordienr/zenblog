import React from "react";

type Props = {};

const Pub = (props: Props) => {
  return (
    <div>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
};

export default Pub;
