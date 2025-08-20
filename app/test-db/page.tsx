import { supabase } from '@/lib/supabase-client';

export default async function TestDB() {
  try {
    // Test reading from user_preferences table
    const { data: preferences, error: prefError } = await supabase
      .from("user_preferences")
      .select("*");

    // Test reading from perk_entries table
    const { data: perks, error: perkError } = await supabase
      .from("perk_entries")
      .select("*");

    if (prefError) throw prefError;
    if (perkError) throw perkError;

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">User Preferences</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
              {JSON.stringify(preferences, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Perk Entries</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
              {JSON.stringify(perks, null, 2)}
            </pre>
          </div>

          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Database connection successful! Your Supabase setup is working.
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
        
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          ❌ Database connection failed: {error instanceof Error ? error.message : 'Unknown error'}
        </div>

        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          🔧 Make sure you have:
          <ul className="list-disc list-inside mt-2 ml-4">
            <li>Created a Supabase project</li>
            <li>Run the SQL setup script</li>
            <li>Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables</li>
          </ul>
        </div>
      </div>
    );
  }
}
