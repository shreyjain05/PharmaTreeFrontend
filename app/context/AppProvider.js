import React, { createContext, useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadUserFromStorage } from "../../redux/authSlice";
import { useSelector } from "react-redux";
import BASE_URL from "../../constant/variable";

export const AppContext = createContext();

console.log("AppProvider Rendered");
const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [products, setProducts] = useState([]); // Store products
  const [wishlistItems, setWishlistItems] = useState([]);
  const [frequentItems, setFrequentItems] = useState([]);
  const [metadata, setMetaData] = useState([]);
  const [isAdmin, setAdmin] = useState("CUSTOMER");
  const [shoppingList, setShoppingList] = useState([]);
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.loggedInUser); // ✅ Use Redux state

  useEffect(() => {
    dispatch(loadUserFromStorage()); // ✅ Load user from AsyncStorage when the app starts
  }, [dispatch]);

  useEffect(() => {
    console.log("use effect App context screen");

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/products`); // Use the correct API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        console.log("after fetch call");

        const data = await response.json();
        console.log("data from app context products api call", data);

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts(); // Call the function inside useEffect, not outside
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        theme,
        setTheme,
        products,
        setProducts,
        loggedInUser,
        wishlistItems,
        frequentItems,
        setFrequentItems,
        setWishlistItems,
        metadata,
        setMetaData,
        isAdmin,
        setAdmin,
        shoppingList,
        setShoppingList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
export default AppProvider;
