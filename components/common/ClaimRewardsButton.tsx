import React from "react";
import { Button } from "@/components/ui/button";
import { useRewardsClaim } from "@/hooks/useRewardsClaim";
import { Gift, CheckCircle, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ClaimRewardsButtonProps {
  userId: string;
  talentUuid: string;
  userScore: number;
  userRank: number;
  className?: string;
}

export function ClaimRewardsButton({
  userId,
  talentUuid,
  userScore,
  userRank,
  className = "",
}: ClaimRewardsButtonProps) {
  const {
    eligibility,
    totalClaimed,
    isLoading,
    isClaiming,
    error,
    claimRewards,
  } = useRewardsClaim({
    userId,
    talentUuid,
    userScore,
    userRank,
  });

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
        <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
        Checking eligibility...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 text-sm text-destructive ${className}`}>
        <AlertCircle className="w-4 h-4" />
        Error: {error}
      </div>
    );
  }

  if (!eligibility) {
    return null;
  }

  // User is not eligible for rewards
  if (!eligibility.canClaim && !eligibility.alreadyClaimed) {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
        <AlertCircle className="w-4 h-4" />
        {eligibility.reason}
      </div>
    );
  }

  // User already claimed rewards
  if (eligibility.alreadyClaimed) {
    return (
      <div className={`flex items-center gap-2 text-sm text-green-600 ${className}`}>
        <CheckCircle className="w-4 h-4" />
        <span className="font-medium">
          Claimed: {formatCurrency(eligibility.amountUsd)}
        </span>
      </div>
    );
  }

  // User can claim rewards
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Gift className="w-4 h-4" />
        <span>
          Available: {formatCurrency(eligibility.amountUsd)}
        </span>
      </div>
      
      <Button
        onClick={claimRewards}
        disabled={isClaiming}
        size="sm"
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        {isClaiming ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Claiming...
          </>
        ) : (
          <>
            <Gift className="w-4 h-4 mr-2" />
            Claim Rewards
          </>
        )}
      </Button>

      {totalClaimed && totalClaimed.claimCount > 0 && (
        <div className="text-xs text-muted-foreground text-center">
          Total claimed: {formatCurrency(totalClaimed.totalUsd)}
        </div>
      )}
    </div>
  );
}
