import { useTempStore } from "app/(player)/_hooks/useTempStore";
import { redirect } from "next/navigation";

export default function Page({ params }: { params: { setlist_id: string } }) {
  const setlistData = useTempStore();
  const setlists = [{ id: 1, data: setlistData }];
  const setlist = setlists.find((set) => set.id === Number(params.setlist_id));

  if (!setlist || !setlist.data || setlist.data.length === 0) redirect("/");
  redirect(`/setlist/${setlist.id}/workout/1`);
}
