import React, { createContext, useState, useEffect } from "react";
import BASE_URL from "../../constant/variable";


export const AppContext = createContext();


const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState("light");
    const [products, setProducts] = useState([]); // Store products
    const [loggedInUser, setLoggedInUser] = useState({});
    const [wishlistItems, setWishlistItems] = useState([]);
    const [frequentItems, setFrequentItems] = useState([]);
    const [metadata, setMetaData] = useState([]);
    const [isAdmin, setAdmin] = useState([]);
    const [shoppingList, setShoppingList] = useState([]);

    // Function to add/remove items from the wishlist
    const toggleWishlistItem = (item) => {
        setWishlistItems((prevItems) => {
            const isItemInWishlist = prevItems.some((wishlistItem) => wishlistItem.id === item.id);
            if (isItemInWishlist) {
                // Remove item from wishlist
                return prevItems.filter((wishlistItem) => wishlistItem.id !== item.id);
            } else {
                // Add item to wishlist
                return [...prevItems, item];
            }
        });
    };

    useEffect(() => {
        console.log("use effect App context screen");

        const fetchProducts = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/v1/products`); // Use the correct API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                console.log("after fetch call");

                const data = await response.json();
                console.log("data from app contetx products api call", data);



                setProducts(data);

            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts(); // Call the function inside useEffect, not outside

    }, []);

    return (
        <AppContext.Provider value={{
            user, setUser, theme, setTheme, products, setProducts, loggedInUser, setLoggedInUser, wishlistItems,
            toggleWishlistItem, frequentItems, setFrequentItems, setWishlistItems, metadata, setMetaData, isAdmin, setAdmin, shoppingList, setShoppingList
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
