"use client"

import { createClient } from "@/utils/supabase/client";






export default function LoginPage() {

    const supabase = createClient();


    async function signIn() {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback`

            },
        });

    }

    return (
        <div className="flex justify-center items-center" >
            <button onClick={signIn}>Countinue with Google</button>
        </div>
    )
}
