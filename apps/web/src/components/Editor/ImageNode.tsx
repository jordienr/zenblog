import React from "react";

type Props = {
  src: string;
};

const ImageNode = (props: Props) => {
  return (
    <div>
      {props.src}
      <img src={props.src} />
    </div>
  );
};

export default ImageNode;
