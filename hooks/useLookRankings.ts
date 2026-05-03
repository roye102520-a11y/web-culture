"use client";

import { useCallback, useEffect, useState } from "react";

import type { RankingBoard, RankingDynasty, RankingItem, RankingTopic } from "@/lib/look-rankings";

interface RankingApiResponse {
  ok: boolean;
  board: RankingBoard;
  topic: RankingTopic;
  dynasty: RankingDynasty;
  total: number;
  items: RankingItem[];
  error?: string;
}

interface Filters {
  board: RankingBoard;
  topic: RankingTopic;
  dynasty: RankingDynasty;
}

interface UseLookRankingsResult {
  filters: Filters;
  items: RankingItem[];
  total: number;
  isLoading: boolean;
  errorMessage: string | null;
  setBoard: (value: RankingBoard) => void;
  setTopic: (value: RankingTopic) => void;
  setDynasty: (value: RankingDynasty) => void;
  retry: () => Promise<void>;
}

export function useLookRankings(): UseLookRankingsResult {
  const [filters, setFilters] = useState<Filters>({ board: "free", topic: "all", dynasty: "all" });
  const [items, setItems] = useState<RankingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRankings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const params = new URLSearchParams({
        board: filters.board,
        topic: filters.topic,
        dynasty: filters.dynasty,
        limit: "10",
      });

      const response = await fetch(`/api/look/rankings?${params.toString()}`, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = (await response.json()) as RankingApiResponse;
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "request_failed");
      }

      setItems(data.items);
      setTotal(data.total);
    } catch {
      setItems([]);
      setTotal(0);
      setErrorMessage("网络似乎开小差了，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchRankings();
  }, [fetchRankings]);

  return {
    filters,
    items,
    total,
    isLoading,
    errorMessage,
    setBoard: (value) => setFilters((prev) => ({ ...prev, board: value })),
    setTopic: (value) => setFilters((prev) => ({ ...prev, topic: value })),
    setDynasty: (value) => setFilters((prev) => ({ ...prev, dynasty: value })),
    retry: fetchRankings,
  };
}
