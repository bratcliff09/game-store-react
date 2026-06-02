import React from "react";

function Error() {
  const styles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    justifySelf: "center",
    height: "100%",
    margin: "16px 0",
  };
  return (
    <main style={styles}>
      <title>Error | GameStore</title>
      <h1>Error 404 - Page Not Found</h1>
      <p>This Page has yet to be created. Come back at a later date!</p>
    </main>
  );
}

export default Error;
