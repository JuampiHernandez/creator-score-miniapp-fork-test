import { useState, useEffect } from "react";
import { RewardsClaimService, ClaimEligibility, RewardClaim } from "@/app/services/rewardsClaimService";

interface UseRewardsClaimProps {
  userId: string;
  talentUuid: string;
  userScore: number;
  userRank: number;
}

interface UseRewardsClaimReturn {
  eligibility: ClaimEligibility | null;
  claimHistory: RewardClaim[];
  totalClaimed: {
    totalUsd: number;
    totalTokens: number;
    claimCount: number;
  } | null;
  isLoading: boolean;
  isClaiming: boolean;
  error: string | null;
  checkEligibility: () => Promise<void>;
  claimRewards: () => Promise<boolean>;
  refreshData: () => Promise<void>;
}

export function useRewardsClaim({
  userId,
  talentUuid,
  userScore,
  userRank,
}: UseRewardsClaimProps): UseRewardsClaimReturn {
  const [eligibility, setEligibility] = useState<ClaimEligibility | null>(null);
  const [claimHistory, setClaimHistory] = useState<RewardClaim[]>([]);
  const [totalClaimed, setTotalClaimed] = useState<{
    totalUsd: number;
    totalTokens: number;
    claimCount: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkEligibility = async () => {
    if (!userId || !talentUuid || userScore <= 0) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const eligibilityData = await RewardsClaimService.checkClaimEligibility(
        userId,
        talentUuid,
        userScore,
        userRank
      );
      
      setEligibility(eligibilityData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check eligibility");
    } finally {
      setIsLoading(false);
    }
  };

  const claimRewards = async (): Promise<boolean> => {
    if (!eligibility?.canClaim) return false;
    
    try {
      setIsClaiming(true);
      setError(null);
      
      const claim = await RewardsClaimService.claimRewards(
        userId,
        talentUuid,
        userScore,
        userRank
      );
      
      // Update eligibility to show as claimed
      setEligibility({
        ...eligibility,
        canClaim: false,
        reason: "Already claimed for this round",
        alreadyClaimed: claim,
      });
      
      // Refresh claim history
      await refreshData();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim rewards");
      return false;
    } finally {
      setIsClaiming(false);
    }
  };

  const refreshData = async () => {
    if (!userId || !talentUuid) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const [history, total] = await Promise.all([
        RewardsClaimService.getUserClaimHistory(userId),
        RewardsClaimService.getUserTotalClaimed(userId),
      ]);
      
      setClaimHistory(history);
      setTotalClaimed(total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  // Check eligibility and load data when dependencies change
  useEffect(() => {
    checkEligibility();
    refreshData();
  }, [userId, talentUuid, userScore, userRank]);

  return {
    eligibility,
    claimHistory,
    totalClaimed,
    isLoading,
    isClaiming,
    error,
    checkEligibility,
    claimRewards,
    refreshData,
  };
}
