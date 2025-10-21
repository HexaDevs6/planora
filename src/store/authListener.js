import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { setUser, clearUser, setLoading } from "./authSlice";

export const startAuthListener = (store) => {

  store.dispatch(setLoading(true));

  onAuthStateChanged(auth, (user) => {
    if (user) {
     
      store.dispatch(setUser(user));
    } else {
 
      store.dispatch(clearUser());
    }
  });
};
