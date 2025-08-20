import { NextRequest, NextResponse } from "next/server";
import { RewardsClaimService } from "@/app/services/rewardsClaimService";
import { getUserContext } from "@/lib/user-context";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export async function POST(request: NextRequest) {
  try {
    // Get user context from the request
    const body = await request.json();
    const { talentUuid, userScore, userRank } = body;

    // Validate required fields
    if (!talentUuid || userScore === undefined || userRank === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: talentUuid, userScore, userRank" },
        { status: 400 }
      );
    }

    // For now, we'll use a simple user ID from the request
    // In production, this should come from proper authentication
    const userId = body.userId || `user-${talentUuid}`;

    // Check if user is eligible to claim
    const eligibility = await RewardsClaimService.checkClaimEligibility(
      userId,
      talentUuid,
      userScore,
      userRank
    );

    if (!eligibility.canClaim) {
      return NextResponse.json(
        { 
          error: "Not eligible to claim rewards",
          reason: eligibility.reason,
          details: eligibility
        },
        { status: 400 }
      );
    }

    // Claim the rewards
    const claim = await RewardsClaimService.claimRewards(
      userId,
      talentUuid,
      userScore,
      userRank
    );

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Rewards claimed successfully!",
      claim: {
        id: claim.id,
        amountUsd: claim.amount_usd,
        amountTokens: claim.amount_tokens,
        claimedAt: claim.claimed_at,
        status: claim.status,
      },
      eligibility: {
        canClaim: false,
        reason: "Already claimed for this round",
        amountUsd: claim.amount_usd,
        amountTokens: claim.amount_tokens,
      },
    });

  } catch (error) {
    console.error("Error claiming rewards:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to claim rewards",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const talentUuid = searchParams.get("talentUuid");

    if (!userId || !talentUuid) {
      return NextResponse.json(
        { error: "Missing required parameters: userId, talentUuid" },
        { status: 400 }
      );
    }

    // Get user's claim history
    const claimHistory = await RewardsClaimService.getUserClaimHistory(userId);
    const totalClaimed = await RewardsClaimService.getUserTotalClaimed(userId);

    return NextResponse.json({
      success: true,
      claimHistory,
      totalClaimed,
    });

  } catch (error) {
    console.error("Error getting claim history:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to get claim history",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
