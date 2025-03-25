import React, { createContext, useState, useEffect, useContext } from "react";

export const AppContext = createContext();

console.log("AppProvider Rendered");
const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [products, setProducts] = useState([]); // Store products
  const [loggedInUser, setLoggedInUser] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const [frequentItems, setFrequentItems] = useState([]);
  const [metadata, setMetaData] = useState([]);
  const [isAdmin, setAdmin] = useState("CUSTOMER");
  const [shoppingList, setShoppingList] = useState([]);

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
        setLoggedInUser,
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
