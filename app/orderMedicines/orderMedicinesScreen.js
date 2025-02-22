import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Colors, Sizes, Fonts } from "../../constant/styles";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../component/myStatusBar";
import { useNavigation } from "expo-router";

const OrderMedicinesScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <MyStatusBar />
            <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
                {header()}
                <View style={styles.offerAndSearchInfoWrapper}>
                    {offersProductsAndReturnsInfo()}
                    {searchInfo()}
                    {orTag()}
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {boughtItemAndPastOrderInfo()}
                    {orderViaPrescriptionInfo()}
                </ScrollView>
            </View>
        </View>
    )

    function orderViaPrescriptionInfo() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.push('uploadPrescription/uploadPrescriptionScreen')}
                style={styles.orderViaPrescriptionInfoWrapStyle}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../../assets/images/icons/icon_7.png')}
                        style={{ height: 20.0, width: 20.0, }}
                    />
                    <Text style={{ paddingLeft: Sizes.fixPadding, ...Fonts.primaryColor19Medium }}>
                        Order via Prescription
                    </Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={20} color={Colors.primaryColor} />
            </TouchableOpacity>
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
                        source={require('../../assets/images/icons/icon_3.png')}
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
                        source={require('../../assets/images/icons/icon_4.png')}
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

    function orTag() {
        return (
            <View style={styles.orTagWrapStyle}>
                <Text style={{ ...Fonts.primaryColor20Medium }}>
                    OR
                </Text>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                }}>
                    <MaterialIcons
                        name="arrow-back"
                        size={24}
                        color={Colors.whiteColor}
                        onPress={() => navigation.pop()}
                    />
                    <Text numberOfLines={1} style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0, ...Fonts.whiteColor19Medium }}>
                        Order Medicines
                    </Text>
                </View>
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
                        <Text style={{ ...Fonts.whiteColor15Regular,lineHeight:21 }}>
                            1
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    function searchInfo() {
        return (
            <View>
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Search medicines/healthcare products
                </Text>
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

    function offersProductsAndReturnsInfo() {
        return (
            <View style={styles.offersProductsAndReturnsInfoWrapStyle}>
                {offersProductsAndReturns(
                    {
                        icon: <MaterialCommunityIcons name="tag" size={18} color={Colors.whiteColor} />,
                        description: 'Flat \n15% Off'
                    }
                )}
                {offersProductsAndReturns(
                    {
                        icon: <MaterialIcons name="security" size={18} color={Colors.whiteColor} />,
                        description: '1 Lakh+\n Products'
                    }
                )}
                {offersProductsAndReturns(
                    {
                        icon: <MaterialCommunityIcons name="layers-outline" size={20} color={Colors.whiteColor} />,
                        description: 'Easy \nReturns'
                    }
                )}
            </View>
        )
    }

    function offersProductsAndReturns({ icon, description }) {
        return (
            <View style={{ flexDirection: 'row', }}>
                <View style={styles.offersProductsAndReturnsIconWrapStyle}>
                    {icon}
                </View>
                <Text style={{ lineHeight: 23.0, ...Fonts.whiteColor16Regular, marginLeft: Sizes.fixPadding }}>
                    {description}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        backgroundColor: Colors.primaryColor,
        height: 56.0,
        flexDirection: "row",
        alignItems: 'center',
        paddingLeft: Sizes.fixPadding * 2.0,
        paddingRight: Sizes.fixPadding,
    },
    offersProductsAndReturnsIconWrapStyle: {
        width: 32.0,
        height: 32.0,
        borderRadius: 16.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.whiteColor, borderWidth: 1.0,
    },
    offersProductsAndReturnsInfoWrapStyle: {
        flexDirection: 'row',
        borderColor: Colors.whiteColor,
        borderStyle: 'dashed',
        borderRadius: Sizes.fixPadding,
        borderWidth: 1.0,
        justifyContent: 'space-evenly',
        paddingVertical: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    searchButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 1.0,
        marginTop: Sizes.fixPadding,
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
        elevation: 2.0,
        overflow: 'hidden'
    },
    orTagWrapStyle: {
        position: 'absolute',
        bottom: -20.0,
        backgroundColor: '#EEEEEE',
        width: 40.0,
        height: 40.0,
        borderRadius: 20.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.whiteColor,
        borderWidth: 2.0,
        alignSelf: 'center'
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
        marginHorizontal: Sizes.fixPadding * 2.0,
        justifyContent: 'space-between',
        marginVertical: Sizes.fixPadding * 4.0,
    },
    orderViaPrescriptionInfoWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        borderColor: 'rgba(0, 150, 136, 0.3)',
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
    },
    offerAndSearchInfoWrapper: {
        backgroundColor: Colors.primaryColor,
        paddingTop: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding * 4.0,
        paddingHorizontal: Sizes.fixPadding,
    }
});

export default OrderMedicinesScreen;