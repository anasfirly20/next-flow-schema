import { useCallback } from "react";

export const DiamondNode = (props) => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="h-16 w-16 rotate-45 rounded-md border border-node-border bg-white">
      {/* <h1>DIAMOND</h1> */}
    </div>
  );
};
