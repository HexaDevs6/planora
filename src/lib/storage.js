import { supabase } from "./supabaseClient";

/**
 * Upload a single file to a specific bucket
 * @param {string} bucket - The name of the storage bucket
 * @param {string} path - The full path (e.g. "events/eventId/thumbnail.jpg")
 * @param {File} file - The file object to upload
 * @param {object} options - Optional upload settings (e.g. { upsert: true })
 * @returns {Promise<object>} - Supabase response data
 */

export async function uploadFile(bucket, path, file, options = { upsert: true }) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, options);
    if (error) {
        throw error;
    }
    return data;
}

/**
 * Get a public URL for a file
 * (works only if the bucket is public)
 * @param {string} bucket - The name of the storage bucket
 * @param {string} path - The file path
 * @returns {string|null} - The public URL or null
 */
export function getPublicUrl(bucket, path) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    // const { data } = supabase.storage.from(bucket).getPublicUrl(path, {
    //     transform: {
    //         quality: 80,
    //         format: "avif",
    //     },
    // });
    return data?.publicUrl || null;
}


/**
 * Create a signed URL for a private file
 * @param {string} bucket - The name of the storage bucket
 * @param {string} path - The file path
 * @param {number} expiresIn - Expiration time in seconds (default: 3600)
 * @returns {Promise<string>} - The signed URL
 */
export async function createSignedUrl(bucket, path, expiresIn = 3600) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

    if (error) throw error;
    return data?.signedUrl;
}

/**
 * Delete one or multiple files from storage 
 * لعرض كل الملفات داخل مجلد معين (مفيد للجاليري)
 * @param {string} bucket - The name of the storage bucket
 * @param {string|string[]} paths - Single path or array of paths to delete
 * @returns {Promise<object>} - Supabase response data
 */
export async function deleteFile(bucket, paths) {
    const array = Array.isArray(paths) ? paths : [paths];
    const { data, error } = await supabase.storage.from(bucket).remove(array);

    if (error) throw error;
    return data;
}

