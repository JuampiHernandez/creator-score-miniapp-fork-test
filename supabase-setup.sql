DROP POLICY IF EXISTS "public can read user_preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "public can read perk_entries" ON public.perk_entries;
DROP POLICY IF EXISTS "public can read notification_runs" ON public.notification_runs;
DROP POLICY IF EXISTS "users can manage their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "users can manage their own perk entries" ON public.perk_entries;
DROP POLICY IF EXISTS "service role can manage notification runs" ON public.notification_runs;

CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id TEXT NOT NULL UNIQUE,
    callout_prefs JSONB DEFAULT '{"dismissedIds": [], "permanentlyHiddenIds": []}'::jsonb,
    opt_out_status BOOLEAN DEFAULT false,
    opt_out_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS perk_entries (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id TEXT NOT NULL,
    perk_slug TEXT NOT NULL,
    entry_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, perk_slug)
);

CREATE TABLE IF NOT EXISTS notification_runs (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    run_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

TRUNCATE TABLE user_preferences, perk_entries, notification_runs RESTART IDENTITY CASCADE;

INSERT INTO user_preferences (user_id, callout_prefs) 
VALUES 
    ('test-user-1', '{"dismissedIds": [], "permanentlyHiddenIds": []}'::jsonb),
    ('test-user-2', '{"dismissedIds": ["welcome-modal"], "permanentlyHiddenIds": []}'::jsonb);

INSERT INTO perk_entries (user_id, perk_slug, status)
VALUES 
    ('test-user-1', 'early-adopter', 'active'),
    ('test-user-2', 'community-member', 'active');

INSERT INTO notification_runs (run_type, status, completed_at)
VALUES 
    ('daily-rewards', 'completed', NOW()),
    ('weekly-leaderboard', 'completed', NOW());

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE perk_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read user_preferences"
ON public.user_preferences
FOR SELECT TO anon
USING (true);

CREATE POLICY "public can read perk_entries"
ON public.perk_entries
FOR SELECT TO anon
USING (true);

CREATE POLICY "public can read notification_runs"
ON public.notification_runs
FOR SELECT TO anon
USING (true);

CREATE POLICY "users can manage their own preferences"
ON public.user_preferences
FOR ALL TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "users can manage their own perk entries"
ON public.perk_entries
FOR ALL TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "service role can manage notification runs"
ON public.notification_runs
FOR ALL TO service_role
USING (true);

SELECT 'Database setup completed successfully!' as status;
