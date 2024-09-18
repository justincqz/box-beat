"use client";

import { Button } from "@mantine/core";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function StartWorkoutButton({
  setlistId,
}: {
  setlistId: number;
}) {
  return (
    <Link href={`/setlist/${setlistId}/workout/1`} style={{ width: "100%" }}>
      <Button
        w="100%"
        variant="outline"
        fw={500}
        fz="1.5rem"
        size="xl"
        color="indigo"
        style={{ borderWidth: "2px" }}
        mt="xl"
        onClick={() => {
          redirect(`/setlist/${setlistId}/workout/1`);
        }}
      >
        Start Workout
      </Button>
    </Link>
  );
}
