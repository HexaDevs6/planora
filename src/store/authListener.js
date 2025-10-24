import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { setUser, clearUser, setLoading } from "./authSlice";

export const startAuthListener = (store) => {

  store.dispatch(setLoading(true));

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userjson = user.toJSON();
      console.log("user", user.toJSON());
      
      store.dispatch(setUser(userjson));
    } else {
      store.dispatch(clearUser());
    }
  });
};
