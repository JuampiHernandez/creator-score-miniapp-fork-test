import { supabase } from "@/lib/supabase-client";

export interface RewardClaim {
  id: number;
  user_id: string;
  talent_uuid: string;
  round_id: string;
  amount_usd: number;
  amount_tokens: number;
  claimed_at: string;
  transaction_hash?: string;
  status: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface ClaimEligibility {
  canClaim: boolean;
  reason?: string;
  amountUsd: number;
  amountTokens: number;
  alreadyClaimed?: RewardClaim;
}

export class RewardsClaimService {
  private static readonly CURRENT_ROUND = "round-1"; // This should come from config

  /**
   * Check if a user can claim rewards for the current round
   */
  static async checkClaimEligibility(
    userId: string,
    talentUuid: string,
    userScore: number,
    userRank: number
  ): Promise<ClaimEligibility> {
    try {
      // Check if user already claimed for this round
      const { data: existingClaim, error: claimError } = await supabase
        .from("rewards_claims")
        .select("*")
        .eq("user_id", userId)
        .eq("round_id", this.CURRENT_ROUND)
        .single();

      if (claimError && claimError.code !== "PGRST116") {
        throw claimError;
      }

      // If already claimed, return the claim details
      if (existingClaim) {
        return {
          canClaim: false,
          reason: "Already claimed for this round",
          amountUsd: existingClaim.amount_usd,
          amountTokens: existingClaim.amount_tokens,
          alreadyClaimed: existingClaim,
        };
      }

      // Check if user is eligible (top 200 and has a score)
      if (!userScore || userScore <= 0) {
        return {
          canClaim: false,
          reason: "No score to claim rewards for",
          amountUsd: 0,
          amountTokens: 0,
        };
      }

      if (!userRank || userRank > 200) {
        return {
          canClaim: false,
          reason: "Not in top 200 - no rewards eligible",
          amountUsd: 0,
          amountTokens: 0,
        };
      }

      // Calculate reward amount (this should match your existing calculation)
      const amountUsd = this.calculateRewardAmount(userScore, userRank);
      const amountTokens = amountUsd; // For now, 1:1 ratio

      return {
        canClaim: true,
        amountUsd,
        amountTokens,
      };
    } catch (error) {
      console.error("Error checking claim eligibility:", error);
      throw error;
    }
  }

  /**
   * Claim rewards for a user
   */
  static async claimRewards(
    userId: string,
    talentUuid: string,
    userScore: number,
    userRank: number
  ): Promise<RewardClaim> {
    try {
      // Double-check eligibility before claiming
      const eligibility = await this.checkClaimEligibility(
        userId,
        talentUuid,
        userScore,
        userRank
      );

      if (!eligibility.canClaim) {
        throw new Error(eligibility.reason || "Not eligible to claim rewards");
      }

      // Create the claim record
      const { data: claim, error: insertError } = await supabase
        .from("rewards_claims")
        .insert({
          user_id: userId,
          talent_uuid: talentUuid,
          round_id: this.CURRENT_ROUND,
          amount_usd: eligibility.amountUsd,
          amount_tokens: eligibility.amountTokens,
          status: "claimed",
          metadata: {
            user_score: userScore,
            user_rank: userRank,
            claimed_at: new Date().toISOString(),
          },
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return claim;
    } catch (error) {
      console.error("Error claiming rewards:", error);
      throw error;
    }
  }

  /**
   * Get claim history for a user
   */
  static async getUserClaimHistory(userId: string): Promise<RewardClaim[]> {
    try {
      const { data: claims, error } = await supabase
        .from("rewards_claims")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return claims || [];
    } catch (error) {
      console.error("Error getting user claim history:", error);
      throw error;
    }
  }

  /**
   * Get total claimed amount for a user
   */
  static async getUserTotalClaimed(userId: string): Promise<{
    totalUsd: number;
    totalTokens: number;
    claimCount: number;
  }> {
    try {
      const claims = await this.getUserClaimHistory(userId);
      
      const totalUsd = claims.reduce((sum, claim) => sum + Number(claim.amount_usd), 0);
      const totalTokens = claims.reduce((sum, claim) => sum + Number(claim.amount_tokens), 0);
      
      return {
        totalUsd,
        totalTokens,
        claimCount: claims.length,
      };
    } catch (error) {
      console.error("Error getting user total claimed:", error);
      throw error;
    }
  }

  /**
   * Calculate reward amount based on score and rank
   * This should match your existing rewards calculation logic
   */
  private static calculateRewardAmount(score: number, rank: number): number {
    // Basic calculation - you can replace this with your actual logic
    if (rank <= 10) return 100 + (score * 0.1);
    if (rank <= 50) return 50 + (score * 0.05);
    if (rank <= 100) return 25 + (score * 0.025);
    if (rank <= 200) return 10 + (score * 0.01);
    return 0;
  }
}
