"use client";
import { useState, useEffect } from "react";

export const useRefreshValue = <T>({ getter }: { getter: () => T }) => {
  const [value, setValue] = useState(getter());

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(getter());
    }, 100);
    return () => clearInterval(interval);
  }, [getter]);

  return value;
};
