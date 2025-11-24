// src/store/categoriesThunks.js
import { supabase } from "@/lib/supabaseClient";
import { setCategories, setLoading } from "./categoriesSlice";

// ✅ Fetch all categories (no filter)
export const fetchCategories = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { data, error } = await supabase
            .from("categories")
            .select("*") //get all
            .order("name", { ascending: true });

        if (error) throw error;

        dispatch(setCategories(data || []));
        return { success: true, categories: data || [] };
    } catch (error) {
        console.error("Fetch categories error:", error.message);
        return { success: false, error: error.message };
    } finally {
        dispatch(setLoading(false));
    }
};
