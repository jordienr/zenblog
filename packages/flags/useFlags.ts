import React, { useEffect, useMemo } from "react";
import hypertune from "./";

export default function useFlags() {
  // Trigger a re-render when flags are updated
  const [, setStateHash] = React.useState<string | null>(
    hypertune.getStateHash()
  );
  useEffect(() => {
    hypertune.addUpdateListener(setStateHash);
    return () => {
      hypertune.removeUpdateListener(setStateHash);
    };
  }, []);

  // Return the Hypertune root node initialized with the current user
  return useMemo(
    () =>
      hypertune.root({
        args: {
          context: {
            environment: "development",
            user: {
              id: "test_id",
              name: "Test",
              email: "test@test.com",
            },
          },
        },
      }),
    []
  );
}
