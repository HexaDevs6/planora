// /src/lib/chatService.js
import { supabase } from "@/lib/supabaseClient";

/**
 * Get canonical current user id from redux user object
 * (we'll pass user.id from components; this is generic helper if needed)
 */

/* ---------- Conversations / Inbox ---------- */

/**
 * Try RPC find_existing_conversation(userA, userB) first.
 * If not found, create conversation + participants.
 * Returns conversation_id (uuid)
 */
export async function createOrGetConversation(currentUserId, otherUserId) {
    // Try RPC that checks existing conversation (race-safe on backend if you've implemented it)
    try {
        const { data: existing, error: rpcErr } = await supabase.rpc(
            "find_existing_conversation",
            { usera: currentUserId, userb: otherUserId }
        );

        if (rpcErr) {
            // Non-fatal: still continue to create fallback
            console.warn(
                "find_existing_conversation rpc error:",
                rpcErr.message
            );
        }

        if (
            existing &&
            existing.length &&
            existing[0].find_existing_conversation
        ) {
            // RPC returns row like [{ find_existing_conversation: <uuid> }]
            return (
                existing[0].find_existing_conversation ||
                existing[0].conversation_id ||
                existing
            );
        }

        // Some RPCs return scalar directly:
        if (existing && typeof existing === "string") return existing;

        // Not found => create new conversation and participants
        const { data: convData, error: convErr } = await supabase
            .from("conversations")
            .insert({}) // if your conversations table requires fields, pass them (e.g., created_by)
            .select("id")
            .single();

        if (convErr) throw convErr;

        const conversationId = convData.id;

        // insert participants (currentUserId + otherUserId)
        const participants = [
            { conversation_id: conversationId, user_id: currentUserId },
            { conversation_id: conversationId, user_id: otherUserId },
        ];

        const { error: partErr } = await supabase
            .from("conversation_participants")
            .insert(participants);
        if (partErr) {
            console.warn(
                "participants insert error (might already exist):",
                partErr.message
            );
            // continue anyway
        }

        return conversationId;
    } catch (err) {
        console.error("createOrGetConversation error:", err.message || err);
        throw err;
    }
}

/**
 * Get inbox via RPC get_user_conversations(userId)
 * Expected to return rows with:
 * { conversation_id, last_message_text, last_sender, last_message_at, other_user_id, other_user_name, other_user_avatar ... }
 */
export async function getInbox(userId) {
    try {
        const { data, error } = await supabase.rpc("get_user_conversations", {
            user_uuid: userId,
        });

        if (error) throw error;

        // Some RPCs return array directly
        return data || [];
    } catch (err) {
        console.error("getInbox error:", err.message || err);
        return [];
    }
}

/* ---------- Messages list & send ---------- */

/**
 * Fetch messages for a conversation ordered asc (old -> new)
 */
export async function getMessages(conversationId) {
    try {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error("getMessages error:", err.message || err);
        return [];
    }
}

/**
 * Send a message (insert). Returns inserted message row.
 */
export async function sendMessage({ conversation_id, sender_id, content }) {
    try {
        const { data, error } = await supabase
            .from("messages")
            .insert({
                conversation_id,
                sender_id,
                content,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (err) {
        console.error("sendMessage error:", err.message || err);
        throw err;
    }
}

/* ---------- Real-time subscription ---------- */

/**
 * Subscribe to new messages for conversationId (or all messages and filter client-side).
 * callback(payload) will be called with payload.record (the new message)
 * Returns a subscription object with `remove()` to unsubscribe.
 */
export function subscribeToNewMessages(conversationId, onNewMessage) {
    const channel = supabase
        .channel(`messages-${conversationId}`)
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "messages",
            },
            (payload) => {
                // manually filter to avoid Supabase V2 filter bugs
                if (payload.new?.conversation_id === conversationId) {
                    onNewMessage(payload.new);
                }
            }
        )
        .subscribe();

    return {
        channel,
        remove: async () => {
            try {
                await supabase.removeChannel(channel);
            } catch (err) {
                console.warn("remove channel failed:", err);
            }
        },
    };
}

/**
 * Global subscribe for any message destined to this user (optional)
 * Useful for updating Inbox in real-time.
 * filterCallback receives payload.new (message)
 */
export function subscribeToInbox(userId, onNewMessageForInbox) {
    // listen to INSERT on messages and then check if this message belongs to any conversation of the user
    // Lightweight approach: listen to messages inserts and call callback; backend RPCs ensure minimal load.
    const channel = supabase
        .channel(`public:messages:inbox_user=${userId}`)
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "messages" },
            (payload) => {
                // caller decides if this message matters (e.g., check participants)
                onNewMessageForInbox &&
                    onNewMessageForInbox(
                        payload.new || payload.record || payload
                    );
            }
        )
        .subscribe();

    return {
        channel,
        remove: async () => {
            try {
                await supabase.removeChannel(channel);
            } catch (err) {
                console.warn("remove channel failed:", err);
            }
        },
    };
}
