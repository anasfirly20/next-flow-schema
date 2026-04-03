import { useCallback } from "react";

export const TextUpdaterNode = (props) => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="h-12 rounded-md border-2 border-node-border bg-white">
      <div>
        {/* <label htmlFor="text">Text:</label> */}
        <input
          id="text"
          name="text"
          onChange={onChange}
          value="Node 1"
          className="h-full w-full p-2 outline-none"
        />
      </div>
    </div>
  );
};
