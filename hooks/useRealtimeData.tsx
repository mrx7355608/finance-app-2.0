import { useEffect } from "react";
import supabase from "@/utils/db";

const useRealtimePosts = () => {
  useEffect(() => {
    const channel = supabase
      .channel("realtime:records")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "records" },
        (payload) => {
          console.log("Update:", payload);
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);
};

export default useRealtimePosts;
