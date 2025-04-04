import { useEffect } from "react";
import supabase from "@/utils/db";

const useRealtimePosts = (callback) => {
  useEffect(() => {
    const channel = supabase
      .channel("realtime:records")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "records" },
        callback,
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);
};

export default useRealtimePosts;
