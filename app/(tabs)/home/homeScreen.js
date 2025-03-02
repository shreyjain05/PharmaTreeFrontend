import React, { useRef, useState, useEffect, createContext, useContext, Pressable } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import { Colors, Fonts, Sizes } from "../../../constant/styles";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import Carousel, { Pagination } from 'react-native-snap-carousel-v4';
import CountDown from 'react-native-countdown-component';
import { useNavigation } from "expo-router";
import { AppContext } from "../../context/AppProvider"
import Svg, { Circle } from "react-native-svg";
import { Picker } from "@react-native-picker/picker";


import defaultProduct from "../../../assets/images/defaultProduct.png"

const { width } = Dimensions.get("window");


const HollowPieChart = ({ achieved, target, color }) => {
    const progress = target > 0 ? achieved / target : 0;
    const percentage = Math.round(progress * 100);
    const radius = 30;
    const strokeWidth = 15;
    const circumference = 2 * Math.PI * radius;
    const progressStroke = circumference * progress;

    return (
        <Svg width={80} height={80} viewBox="0 0 80 80">
            {/* Background Circle */}
            <Circle
                cx="40"
                cy="40"
                r={radius}
                stroke="#1F002C"
                strokeWidth={strokeWidth}
                fill="none"
            />
            {/* Progress Circle */}
            <Circle
                cx="40"
                cy="40"
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${progressStroke}, ${circumference}`}
                strokeLinecap="round"
                rotation="-90"
                origin="40,40"
            />
        </Svg>
    );
};

const TargetProgress = () => {

    const { metadata } = useContext(AppContext);

    useEffect(() => {
        console.log("metadata in HomeScreen:", metadata);

    }, [metadata]);

    //const metaData = JSON.parse(loggedInUser?.metaData || "{}");

    // const targets = metaData.customerTargets || [];
    const targets = metadata.customerTargets?.filter(target => target.targetValue > 0) || [];
    const targetColors = {
        Yearly: "#FFC412",
        Monthly: "#FF30A2",
        Quaterly: "#09DBD0",
    };

    console.log('Customer meta data :', metadata);
    console.log('Customer targets :', targets);
    const [selectedTargetType, setSelectedTargetType] = useState(targets.length > 0 ? targets[0].targetType : "Yearly");

    // Get selected target details
    const selectedTarget = targets.find(target => target.targetType === selectedTargetType);

    if (!selectedTarget) return null;
    const getRemainingTime = (targetType, targetEndDate) => {
        const now = new Date();
        const endDate = targetEndDate ? new Date(targetEndDate) : new Date();

        // Set default end date based on target type
        if (!targetEndDate) {
            switch (targetType) {
                case "Yearly":
                    endDate.setFullYear(now.getFullYear() + 1);
                    break;
                case "Monthly":
                    endDate.setMonth(now.getMonth() + 1);
                    break;
                case "Quaterly":
                    endDate.setMonth(now.getMonth() + 3);
                    break;
                default:
                    endDate.setMonth(now.getMonth() + 1);
            }
        }

        // Calculate the difference in days or weeks
        const timeDiff = endDate - now;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const weeksLeft = Math.ceil(daysLeft / 7);

        // if (targetType === "Yearly" || targetType === "Monthly") {
        //     return `Doing great, ${weeksLeft} weeks left to achieve this target.`;
        // } else {
        //     return `Doing great, ${daysLeft} days left to achieve this target.`;
        // }
    };
    const remainingTimeMessage = getRemainingTime(selectedTarget.targetType, selectedTarget.targetEndDate);


    return (
        <View style={{ paddingVertical: 20, backgroundColor: "white", marginTop: 20, paddingBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", paddingHorizontal: 20, marginBottom: 20 }}>
                Your Targets
            </Text>

            {/* Dropdown for selecting target type */}
            <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                <Picker
                    selectedValue={selectedTargetType}
                    onValueChange={(itemValue) => setSelectedTargetType(itemValue)}
                    style={{ backgroundColor: "#FAFAFA", borderRadius: 5, padding: 5 }}
                >
                    {targets.map((target, index) => (
                        <Picker.Item key={index} label={target.targetType} value={target.targetType} />
                    ))}
                </Picker>
            </View>

            {/* Display only selected target */}
            <View style={{ alignItems: "center", paddingHorizontal: 10 }}>

                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.whiteColor,
                        borderRadius: 12,
                        padding: 20,
                        alignItems: "center",
                        width: "90%",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 6,
                        elevation: 5,
                    }}
                    activeOpacity={0.8}
                >
                    {/* Circular Chart with Subtle Background */}
                    <View style={{ alignItems: "center", marginBottom: 15 }}>
                        <View
                            style={{
                                backgroundColor: Colors.lightGrayColor,
                                borderRadius: 100,
                                padding: 12,
                            }}
                        >
                            <HollowPieChart
                                achieved={selectedTarget.achievedValue || 0}
                                target={selectedTarget.targetValue}
                                color={targetColors[selectedTarget.targetType] || "gray"}
                            />
                        </View>
                    </View>

                    {/* Target Type (Heading) */}
                    <Text style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: Colors.companyPrimaryDark,
                        marginBottom: 4,
                    }}>
                        {selectedTarget.targetType}
                    </Text>

                    {/* Achieved / Target Value with Progress Bar */}
                    <View style={{ width: "80%", alignItems: "center", marginBottom: 10 }}>
                        <Text style={{
                            fontSize: 15,
                            fontWeight: "500",
                            color: Colors.blackColor,
                            marginBottom: 5,
                        }}>
                            {selectedTarget.achievedValue || 0} / {selectedTarget.targetValue}
                        </Text>


                    </View>

                    {/* Remaining Time Message */}
                    <Text style={{
                        fontSize: 14,
                        color: Colors.gray,
                        textAlign: "center",
                    }}>
                        {remainingTimeMessage}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

};

const HomeScreen = () => {

    const navigation = useNavigation();

    const [productApiData, setProductApiData] = useState([]);

    const { products, setLoggedInUser, loggedInUser, wishlistItems, frequentItems, metadata } = useContext(AppContext);

    useEffect(() => {
        console.log("Products updated in HomeScreen:", products);

    }, [products]); // Runs every time `products` change

    useEffect(() => {
        console.log("loggedInUser in HomeScreen:", loggedInUser);

    }, [loggedInUser]); // Runs every time `products` change

    useEffect(() => {
        console.log("wishlistItems in HomeScreen:", wishlistItems);

    }, [wishlistItems]);

    useEffect(() => {
        console.log("frequentItems in HomeScreen:", frequentItems);

    }, [frequentItems]);


    return (

        <ScrollView style={{ flex: 1, backgroundColor: Colors.companyLight }} showsVerticalScrollIndicator={false}>
            <HeaderInfo userInfo={loggedInUser} navigation={navigation} />
            <OfferBanner />
            <Products productApiData={products} navigation={navigation} />
            <WishedProducts productApiData={wishlistItems} navigation={navigation} />
            {/* {dealsOfTheDayInfo()} */}
            <FrequentlyOrdered productApiData={frequentItems} navigation={navigation} />
            <TargetProgress />
        </ScrollView>

    )

    function rateNowButton() {
        return (
            <View style={styles.rateNowButtonStyle}>
                <MaterialIcons name="star-rate" size={24} color={Colors.primaryColor} />
                <Text style={{ ...Fonts.primaryColor19Medium, marginLeft: Sizes.fixPadding }}>
                    Rate us Now
                </Text>
            </View>
        )
    }

    function topCategoriesTitle() {
        return (
            <View style={{
                paddingHorizontal: Sizes.fixPadding * 2.0,
                backgroundColor: Colors.whiteColor,
                paddingBottom: Sizes.fixPadding - 5.0,
            }}>
                <Text style={{ ...Fonts.blackColor19Medium, marginTop: Sizes.fixPadding + 3.0, marginBottom: Sizes.fixPadding - 5.0 }}>
                    Top Categories
                </Text>
            </View>
        )
    }

    function dealsOfTheDayInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.push('productDescription/productDescriptionScreen', { item: JSON.stringify(item), from: 'home' })}
            >
                <View style={styles.dealsOfTheDayInfoWrapStlye}>
                    <Image
                        source={item.image}
                        style={{ width: 140.0, height: 140.0, }}
                        resizeMode="contain"
                    />
                    <View style={styles.percentageOffWrapStyle}>
                        <Text style={{ ...Fonts.whiteColor16Medium }}>
                            {item.percentageOff}% OFF
                        </Text>
                    </View>
                </View>
                <Text numberOfLines={2} style={{ marginTop: Sizes.fixPadding, ...Fonts.blackColor19Medium, width: 190.0, lineHeight: 24.0, }}>
                    {item.name}
                </Text>
                <View style={{ marginTop: Sizes.fixPadding - 17.0, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ ...Fonts.primaryColor25Medium }}>
                        ${item.discountPrice}
                    </Text>
                </View>
            </TouchableOpacity>
        )

        return (
            <View style={{ marginBottom: Sizes.fixPadding * 2.0, backgroundColor: Colors.whiteColor }}>
                <View style={{ flexDirection: 'row', marginTop: Sizes.fixPadding + 3.0, marginHorizontal: Sizes.fixPadding * 2.0, alignItems: 'center', justifyContent: "space-between" }}>
                    <Text style={{ ...Fonts.blackColor19Medium }}>
                        Frequently Ordered Products
                    </Text>
                    <Text style={{ ...Fonts.primaryColor18Medium }}>
                        View All
                    </Text>
                </View>
                <FlatList
                    horizontal
                    data={dealsOfTheDaysList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding * 2.0,
                        paddingTop: Sizes.fixPadding,
                        paddingBottom: Sizes.fixPadding * 2.0
                    }}
                />
            </View>
        )
    }

    function featuredBrandsInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.push('availableProduct/availableProductScreen')}
            >
                <Image
                    source={item.image}
                    style={styles.featuredBrandsImageStyle}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        )
        return (
            <View style={{ marginBottom: Sizes.fixPadding * 2.0, backgroundColor: Colors.whiteColor }}>
                <Text style={{ ...Fonts.blackColor19Medium, marginTop: Sizes.fixPadding + 3.0, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                    Featured Brands
                </Text>
                <FlatList
                    horizontal
                    data={featuredBrandsList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding * 2.0,
                        paddingTop: Sizes.fixPadding,
                        paddingBottom: Sizes.fixPadding * 2.0
                    }}
                />
            </View>
        )
    }

    function handPickedItemsInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.push('productDescription/productDescriptionScreen', { item: JSON.stringify(item), from: 'home' })}
            >
                <View style={styles.handPickedItemsImageWrapStyle}>
                    {/* <Image
                        source={item.image}
                        style={{ width: 140.0, height: 140.0, }}
                        resizeMode="contain"
                    /> */}
                    <View style={styles.percentageOffWrapStyle}>
                        <Text style={{ ...Fonts.whiteColor16Medium }}>
                            {item.productInventoryList?.length > 0 ? item.productInventoryList[0]?.discount + "% OFF" : ""}
                        </Text>
                    </View>
                </View>
                <Text numberOfLines={2} style={{ marginTop: Sizes.fixPadding, ...Fonts.blackColor19Medium, width: 190.0, lineHeight: 24.0, }}>
                    {item.name}
                </Text>
                <Text style={{ ...Fonts.primaryColor18Regular, marginTop: Sizes.fixPadding - 15.0 }}>
                    {item.packingName}
                    {/* {item.tabletsOrCapsulesCount} {item.type} in Bottle */}
                </Text>
                <View style={{ marginTop: Sizes.fixPadding - 17.0, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ ...Fonts.primaryColor25Medium }}>
                        ${item.saleRate}
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <View style={{ marginVertical: Sizes.fixPadding * 2.0, backgroundColor: Colors.whiteColor }}>
                <Text style={{ ...Fonts.blackColor19Medium, marginTop: Sizes.fixPadding + 3.0, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                    Handpicked Items for You
                </Text>
                <FlatList
                    horizontal
                    data={products}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding * 2.0,
                        paddingTop: Sizes.fixPadding,
                        paddingBottom: Sizes.fixPadding * 2.0
                    }}
                />
            </View>
        )
    }

    function orderAndProductInfo() {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: Sizes.fixPadding * 2.0,
            }}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.push('orderMedicines/orderMedicinesScreen')}
                    style={{ ...styles.orderAndProductInfoStyle, marginRight: Sizes.fixPadding - 5.0, }}>
                    <Image
                        source={require('../../../assets/images/icons/icon_1.png')}
                        style={{ height: 60.0, width: 60.0 }}
                        resizeMode="contain"
                    />
                    <Text style={{ ...Fonts.blackColor17Medium, }}>
                        Order Medicines
                    </Text>
                    <Text style={{ ...Fonts.redColor14Regular, }}>
                        FLAT 15% OFF
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate('healthcare/healthcareScreen')}
                    style={{ ...styles.orderAndProductInfoStyle, marginLeft: Sizes.fixPadding - 5.0, }}>
                    <Image
                        source={require('../../../assets/images/icons/icon_2.png')}
                        style={{ height: 60.0, width: 60.0 }}
                        resizeMode="contain"
                    />
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor17Medium }}>
                        Healthcare Products
                    </Text>
                    <Text style={{ ...Fonts.redColor14Regular }}>
                        UPTO 60% OFF
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function boughtItemAndPastOrderInfo() {
        return (
            <View style={styles.boughtItemAndPastOrderInfoWrapStyle}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.push('previouslyBoughtItems/previouslyBoughtItemsScreen')}
                    style={{ ...styles.boughtItemAndPastOrderInfoStyle, marginRight: Sizes.fixPadding - 5.0 }}
                >
                    <Image
                        source={require('../../../assets/images/icons/icon_3.png')}
                        style={{ height: 30.0, width: 30.0 }}
                        resizeMode="contain"
                    />
                    <Text numberOfLines={2} style={styles.boughtItemAndPastOrderTextStyle}>
                        1 Previously Bought Item
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.push('previouslyBoughtItems/previouslyBoughtItemsScreen')}
                    style={{ ...styles.boughtItemAndPastOrderInfoStyle, marginLeft: Sizes.fixPadding - 5.0, }}
                >
                    <Image
                        source={require('../../../assets/images/icons/icon_4.png')}
                        style={{ height: 30.0, width: 30.0 }}
                        resizeMode="contain"
                    />
                    <Text style={styles.boughtItemAndPastOrderTextStyle}>
                        1 Past Order
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function offerBanners() {
        return (
            <View>
                <Carousel
                    ref={flatListRef}
                    data={offers}
                    sliderWidth={width}
                    autoplayInterval={4000}
                    itemWidth={width}
                    renderItem={_renderItem}
                    onSnapToItem={(index) => updateState({ activeSlide: index })}
                />
                {pagination()}
            </View>
        )
    }

    function _renderItem({ item }) {
        return (
            <Image
                source={item.image}
                style={{ width: width, height: 180.0 }}
                resizeMode="cover"
            />
        )
    }

    function pagination() {
        return (
            <Pagination
                dotsLength={offers.length}
                activeDotIndex={activeSlide}
                containerStyle={styles.sliderPaginationWrapStyle}
                dotStyle={styles.sliderActiveDotStyle}
                inactiveDotStyle={styles.sliderInactiveDotStyle}
            />
        );
    }

    function headerWithDetail() {
        return (
            <View style={{
                backgroundColor: Colors.primaryColor,
                padding: Sizes.fixPadding,
                flexDirection: 'column'
            }}>
                <View style={styles.headerInfoWrapStyle}>
                    <View>
                        <Text style={{ ...Fonts.whiteColor20Medium }}>
                            HealthMeds
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ ...Fonts.whiteColor15Light }}>
                                Deliver To
                            </Text>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => navigation.push('chooseLocation/chooseLocationScreen')}
                                style={{ flexDirection: 'row', alignItems: 'center', marginLeft: Sizes.fixPadding - 3.0 }}
                            >
                                <Text style={{ ...Fonts.whiteColor16Medium }}>
                                    99501  Anchorage
                                </Text>
                                <MaterialIcons name="keyboard-arrow-down" size={24} color={Colors.whiteColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <MaterialCommunityIcons
                            name="tag"
                            size={26}
                            color={Colors.whiteColor}
                            onPress={() => navigation.push('offers/offersScreen')}
                        />
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => navigation.push('cart/cartScreen')}
                        >
                            <MaterialIcons
                                name="shopping-cart"
                                size={26}
                                color={Colors.whiteColor}
                                style={{ marginLeft: Sizes.fixPadding + 10.0 }}
                            />
                            <View style={styles.cartItemCountWrapStyle}>
                                <Text style={{ ...Fonts.whiteColor15Regular, lineHeight: 21.0 }} >
                                    1
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View >
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.push('search/searchScreen')}
                    style={styles.searchButtonStyle}
                >
                    <MaterialIcons name="search" size={22} color={Colors.primaryColor} />
                    <Text numberOfLines={1} style={{ ...Fonts.primaryColor18Medium, marginLeft: Sizes.fixPadding, flex: 1 }}>
                        Search medicines/healthcare products
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

// 1️⃣ Header Component
const HeaderInfo = ({ userInfo, navigation }) => (


<View style={{
    backgroundColor: Colors.companyPrimaryDark,
    padding: 20,
    paddingBottom: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
}}>
    {/* Left Side: Profile Icon + Greeting */}
    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Image 
            source={require("../../../assets/images/app_icon.png")} // Replace with actual image path
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
        />
        <View>
            <Text style={{ fontSize: 16, color: "white" }}>Hello,</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>{userInfo.firstName}</Text>
        </View>
    </View>

    {/* Right Side: Icons */}
    <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
        <View style={{ alignItems: "center" }}>
            <TouchableOpacity
                onPress={() => navigation.push('cart/cartScreen')}
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <MaterialCommunityIcons name="cart" size={24} color="white" />
            </TouchableOpacity>
            <Text style={{ fontSize: 10, fontWeight: "bold", color: "white" }}>Cart</Text>
        </View>
    </View>
</View>


);
// 2️⃣ Offer Banner Component
const OfferBanner = () => {
    const offers = [
        { id: 1, image: require('../../../assets/images/slider/slider_1.jpg'), },
        { id: 2, image: require('../../../assets/images/slider/slider_2.jpg'), },
        { id: 2, image: require('../../../assets/images/slider/slider_3.jpg'), },
    ];
    const [activeSlide, setActiveSlide] = useState(0);

    return (

        <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", paddingHorizontal: 10, paddingVertical: 20, backgroundColor: "white" }}>Explore Great deals</Text>

            <Carousel
                data={offers}
                sliderWidth={width}
                itemWidth={width}
                autoplay
                loop
                autoplayInterval={4000}
                // onSnapToItem={(index) => setActiveSlide(index)} // ✅ Update active slide
                enableMomentum={false} // Ensures smooth snap behavior
                decelerationRate="fast" // Speeds up carousel response
                scrollEventThrottle={16} // Faster state updates
                onSnapToItem={setActiveSlide} // ✅ Fastest method
                backgroundColor="white"
                renderItem={({ item }) => (
                    // <Image source={{ uri: item.image }} style={{
                    //     width, height: 200, borderBottomLeftRadius: 10,
                    //     borderBottomRightRadius: 10
                    // }} />
                    <Image
                        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                        style={{
                            width,
                            height: 200,
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10
                        }}
                    />
                )}
            />
            {/* ✅ Pagination Dots */}
            {/* <Pagination
                dotsLength={offers.length}
                activeDotIndex={activeSlide}
                containerStyle={{ paddingVertical: 10 }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "blue",
                }}
                inactiveDotStyle={{
                    backgroundColor: "gray",
                }}
                inactiveDotOpacity={0.5}
                inactiveDotScale={0.8}
            /> */}
        </View>
    );
};

const WishedProducts = ({ productApiData, navigation }) => {
    if (!productApiData.length) return null;
    const onProductClick = (item) => {
        console.log("clicked on ", item);

        // Navigate to the ProductDescriptionScreen with the item passed as openedProduct
        navigation.push('productDescription/productDescriptionScreen', {
            openedProduct: JSON.stringify(item), // Pass the item as openedProduct
        });
    };
    //const isWishlisted = wishlistItems.some((wishlistItem) => wishlistItem.id === item.id);
    const renderItem = ({ item }) => {


        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onProductClick(item)}
                style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    marginRight: 0,
                    // width: 160,
                    alignItems: "flex-start", // Aligns text to the left
                    position: "relative",
                    padding: 10, // Added padding for better spacing
                }}
            >
                {/* Image + Discount Wrap with Border */}
                <View style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: Colors.companyPrimaryDark,
                    overflow: "hidden",
                    padding: 20,
                    width: "100%", // Ensures it spans full width inside TouchableOpacity
                    alignItems: "center",
                    position: "relative"
                }}>
                    {/* Product Image */}
                    <Image
                        source={require("../../../assets/images/defaultProduct.png")}
                        style={{ width: 140, height: 140 }}
                        resizeMode="contain"
                    />

                    {/* 🔥 Discount Badge */}
                    {item.productInventoryList[0].discount && (
                        <View
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                backgroundColor: "#FF5733",
                                paddingVertical: 8,
                                paddingHorizontal: 8,
                                // borderTopLeftRadius: 5,
                                borderBottomRightRadius: 8, // Right-bottom border only
                            }}
                        >
                            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
                                {item.productInventoryList[0].discount}% OFF
                            </Text>
                        </View>
                    )}
                </View>
                <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                        fontSize: 18,
                        // fontWeight: "bold",
                        textAlign: "left",
                        marginTop: 5,
                        color: Colors.companyPrimaryDark,
                        width: "100%" // Ensures text spans full width
                    }}
                >
                    {item.name}
                </Text>

                {/* Price & Discount (Left-aligned) */}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FF5733" }}>
                        {/* ${item.productInventoryList[0].saleRate} */}
                        {`₹${item.productInventoryList[0].saleRate}`}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    };

    return (
        <View style={{ paddingVertical: 20, backgroundColor: "white" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Your Wishlist</Text>
                <TouchableOpacity onPress={() => navigation.push("allProducts/allProducts")}>
                    <Text style={{ fontSize: 16, color: `${Colors.companyPrimaryDark}` }}>View All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                horizontal
                data={productApiData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 10 }}
            />
        </View>
    );
};

const Products = ({ productApiData, navigation }) => {
    
    if (!productApiData.length) return null;

    const onProductClick = (item) => {
        console.log("clicked on ", item);

        // Navigate to the ProductDescriptionScreen with the item passed as openedProduct
        navigation.push('productDescription/productDescriptionScreen', {
            openedProduct: JSON.stringify(item), // Pass the item as openedProduct
        });
    };

    return (
        <View style={{ paddingVertical: 20, backgroundColor: "#f8f8f8", marginTop: 20 }}>
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#10857F", // Light background
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: 10,
            margin: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>Products</Text>
            <TouchableOpacity onPress={() => navigation.push("allProducts/allProducts")}> 
                <Text style={{ fontSize: 16, color: Colors.companyPrimaryDark, fontWeight: "600" }}>View All</Text>
            </TouchableOpacity>
        </View>

    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 10 }}>
        {productApiData.slice(0, 4).map((item, index) => (
            <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => onProductClick(item)}
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    alignItems: "flex-start",
                    //padding: 12,
                    width: "48%",
                    marginBottom: 15,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.5,
                    shadowRadius: 4,
                    elevation: 3
                }}>
                <View style={{
                    //borderRadius: 12,
                    //borderWidth: 1,
                    borderColor: Colors.companyPrimaryDark,
                    overflow: "hidden",
                    //padding: 20,
                    width: "100%",
                    alignItems: "center",
                    backgroundColor: "#fff"
                }}>
                    <Image
    source={item.image ? { uri: item.image } : require("../../../assets/images/defaultProduct.png")}
    style={{ width: "100%", height: 140, borderRadius: 8 }}
    resizeMode="contain"
/>
                    {item.productInventoryList[0]?.discount && (
                        <View style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            backgroundColor: "#FF5733",
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                            borderBottomRightRadius: 8
                        }}>
                            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
                                {item.productInventoryList[0].discount}% OFF
                            </Text>
                        </View>
                    )}
                </View>

                <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                        fontSize: 18,
                        fontWeight: "600",
                        textAlign: "left",
                        margin: 8,
                        color: Colors.companyPrimaryDark,
                        width: "100%"
                    }}>
                    {item.name}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", margin: 6 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FF5733" }}>
                        {`₹${item.productInventoryList[0]?.saleRate}`}
                    </Text>
                </View>
            </TouchableOpacity>
        ))}
    </View>
</View>

    );
};

const FrequentlyOrdered = ({ productApiData, navigation }) => {

    if (!productApiData.length) return null;
    const onProductClick = (item) => {
        console.log("clicked on ", item);

        navigation.push('productDescription/productDescriptionScreen', {
            openedProduct: JSON.stringify(item)
        });
    };

    // Calculate remaining time until midnight
    const getSecondsUntilMidnight = () => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(23, 59, 59, 999);
        return Math.floor((midnight - now) / 1000);
    };

    const [timeLeft, setTimeLeft] = useState(getSecondsUntilMidnight());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getSecondsUntilMidnight());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onProductClick(item)}
            style={{
                backgroundColor: "white",
                borderRadius: 10,
                marginRight: 0,
                alignItems: "flex-start",
                position: "relative",
                padding: 10,
            }}
        >
            <View style={{
                borderRadius: 10,
                borderWidth: 1,
                borderColor: Colors.companyPrimaryDark,
                overflow: "hidden",
                padding: 20,
                width: "100%",
                alignItems: "center",
                position: "relative"
            }}>
                <Image
                    source={require("../../../assets/images/defaultProduct.png")}
                    style={{ width: 140, height: 140 }}
                    resizeMode="contain"
                />
                {item.productInventoryList[0].discount && (
                    <View
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            backgroundColor: "#FF5733",
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                            borderBottomRightRadius: 8,
                        }}
                    >
                        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
                            {item.productInventoryList[0].discount}% OFF
                        </Text>
                    </View>
                )}
            </View>

            <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                    fontSize: 18,
                    textAlign: "left",
                    marginTop: 5,
                    color: Colors.companyPrimaryDark,
                    width: "100%"
                }}
            >
                {item.name}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FF5733" }}>

                    {`₹${item.productInventoryList[0].saleRate}`}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ paddingVertical: 20, backgroundColor: "white", marginTop: 20 }}>
            {/* Countdown Timer */}


            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Frequently Ordered Products</Text>
                <TouchableOpacity onPress={() => navigation.push("allProducts/allProducts")}>
                    <Text style={{ fontSize: 16, color: `${Colors.companyPrimaryDark}` }}>View All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                horizontal
                data={productApiData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 10 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 1.0,
        marginTop: Sizes.fixPadding + 5.0
    },
    headerInfoWrapStyle: {
        flexDirection: 'row',
        paddingLeft: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cartItemCountWrapStyle: {
        position: 'absolute',
        right: -8.0,
        height: 17.0,
        width: 17.0,
        borderRadius: 8.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.redColor,
        elevation: 10.0,
    },
    sliderActiveDotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5.0,
        backgroundColor: Colors.primaryColor,
        marginHorizontal: Sizes.fixPadding - 15.0
    },
    sliderInactiveDotStyle: {
        width: 9,
        height: 9,
        borderRadius: 4.5,
        backgroundColor: Colors.primaryColor
    },
    sliderPaginationWrapStyle: {
        position: 'absolute',
        bottom: -20.0,
        left: 0.0,
        right: 0.0,
    },
    boughtItemAndPastOrderInfoStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        borderColor: 'rgba(0, 150, 136, 0.3)',
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        flex: 1,
        paddingHorizontal: Sizes.fixPadding,
        height: 65.0,
    },
    boughtItemAndPastOrderTextStyle: {
        flex: 1,
        paddingTop: 10.0,
        marginLeft: Sizes.fixPadding,
        ...Fonts.blackColor20Medium,
        lineHeight: 24.0,
    },
    boughtItemAndPastOrderInfoWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: Sizes.fixPadding * 2.0,
        justifyContent: 'space-between',
    },
    orderAndProductInfoStyle: {
        flex: 1,
        backgroundColor: Colors.whiteColor,
        borderColor: 'rgba(0, 150, 136, 0.3)',
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding * 3.0,
    },
    percentageOffWrapStyle: {
        position: 'absolute',
        left: -0.60,
        top: -0.50,
        backgroundColor: Colors.redColor,
        borderTopLeftRadius: Sizes.fixPadding,
        borderBottomRightRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding - 4.0,
    },
    handPickedItemsImageWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: 'rgba(0, 150, 136, 0.3)',
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginRight: Sizes.fixPadding * 2.0,
        width: 190.0,
        height: 180.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featuredBrandsImageStyle: {
        width: 165.0,
        height: 240.0,
        borderColor: 'rgba(0, 150, 136, 0.5)',
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginRight: Sizes.fixPadding * 2.0
    },
    dealsOfTheDayInfoWrapStlye: {
        backgroundColor: Colors.whiteColor,
        borderColor: 'rgba(0, 150, 136, 0.3)',
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginRight: Sizes.fixPadding * 2.0,
        width: 190.0,
        height: 180.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rateNowButtonStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: 'rgba(0, 150, 136, 0.5)',
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        flexDirection: 'row',
        alignItems: 'center',
        margin: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding + 5.0
    },
    topCategoriesWrapStyle: {
        backgroundColor: Colors.whiteColor,
        width: width / 2.0,
        alignItems: 'center'
    },
    animatedView: {
        backgroundColor: "#333333",
        position: "absolute",
        bottom: 0,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default HomeScreen;