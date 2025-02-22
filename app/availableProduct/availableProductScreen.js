import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MyStatusBar from "../../component/myStatusBar";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get('screen');

const availableProductsList = [
    {
        id: '1',
        image: require('../../assets/images/product/product_1/1.png'),
        allImages: [
            {
                id: '1',
                image: require('../../assets/images/product/product_1/1.png'),
            },
            {
                id: '2',
                image: require('../../assets/images/product/product_1/2.png'),
            },
            {
                id: '3',
                image: require('../../assets/images/product/product_1/3.png'),
            }
        ],
        name: 'B-protin Chocolate Nutrition Supplement Bottle Of 500 G 500g',
        discountPrice: '7',
        price: '8',
        percentageOff: 5,
        flavours: [
            {
                id: '1',
                flavour: 'Chocolate',
            },
            {
                id: '2',
                flavour: 'Dry Fruit',
            }
        ],
        packageSizes: [
            {
                id: '1',
                size: '500g',
            },
            {
                id: '2',
                size: '200g',
            },
        ],
        brand: 'B-Protin',
        manufacturer: 'British Biologicals',
    },
    {
        id: '2',
        image: require('../../assets/images/product/product_2/1.png'),
        allImages: [
            {
                id: '1',
                image: require('../../assets/images/product/product_2/1.png'),
            },
            {
                id: '2',
                image: require('../../assets/images/product/product_2/2.png'),
            },
        ],
        name: 'Himalaya Baby Masage Body Oil Bottle 100ml',
        discountPrice: '1.5',
        price: '1.8',
        percentageOff: 20,
        packageSizes: [
            {
                id: '1',
                size: '100ml',
            },
            {
                id: '2',
                size: '200ml',
            },
            {
                id: '3',
                size: '500ml',
            }
        ],
        brand: 'HIMALAYA',
        manufacturer: 'The Himalaya Drug Company',
    },
    {
        id: '3',
        image: require('../../assets/images/product/product_3/1.png'),
        allImages: [
            {
                id: '1',
                image: require('../../assets/images/product/product_3/1.png'),
            },
        ],
        name: 'Wzee Velewt Tissue Paper Packet 100 No\'s',
        discountPrice: '1',
        price: '1.5',
        percentageOff: 33,
        packageSizes: [
            {
                id: '1',
                size: '50 No\'s',
            },
            {
                id: '2',
                size: '100 No\'s',
            },
        ],
        brand: 'Ezee',
        manufacturer: 'Alka Lifestyles Private Limited',
    },
    {
        id: '4',
        image: require('../../assets/images/product/product_4/1.png'),
        allImages: [
            {
                id: '1',
                image: require('../../assets/images/product/product_4/1.png'),
            },
            {
                id: '2',
                image: require('../../assets/images/product/product_4/2.png'),
            },
            {
                id: '3',
                image: require('../../assets/images/product/product_4/3.png'),
            },
            {
                id: '4',
                image: require('../../assets/images/product/product_4/4.png'),
            },
        ],
        name: '3 Ply Mask Packet 50 No\'s',
        discountPrice: 9,
        price: 18,
        percentageOff: 50,
        packageSizes: [
            {
                id: '1',
                size: '50 No\'s',
            },
            {
                id: '2',
                size: '100 No\'s',
            },
        ],
        brand: 'N95 Masks',
        manufacturer: 'Surgical',
    },
    {
        id: '5',
        image: require('../../assets/images/product/product_5/1.png'),
        allImages: [
            {
                id: '1',
                image: require('../../assets/images/product/product_5/1.png'),
            },
            {
                id: '2',
                image: require('../../assets/images/product/product_5/2.png'),
            },
            {
                id: '3',
                image: require('../../assets/images/product/product_5/3.png'),
            },
            {
                id: '4',
                image: require('../../assets/images/product/product_5/4.png'),
            },
        ],
        name: 'Cipla Maxirich Multivitamin & Minerals Sofgels 10 No\'s',
        discountPrice: '5',
        price: '8',
        percentageOff: 30,
        packageSizes: [
            {
                id: '1',
                size: '10 No\'s',
            },
            {
                id: '2',
                size: '30 No\'s',
            },
        ],
        brand: 'Cipla',
        manufacturer: 'Geltec Pvt Ltd',
    },
    {
        id: '6',
        image: require('../../assets/images/product/product_6/1.png'),
        allImages: [
            {
                id: '1',
                image: require('../../assets/images/product/product_6/1.png'),
            },
            {
                id: '2',
                image: require('../../assets/images/product/product_6/2.png'),
            },
            {
                id: '3',
                image: require('../../assets/images/product/product_6/3.png'),
            },
            {
                id: '4',
                image: require('../../assets/images/product/product_6/4.png'),
            },
            {
                id: '5',
                image: require('../../assets/images/product/product_6/5.png'),
            },
            {
                id: '6',
                image: require('../../assets/images/product/product_6/6.png'),
            },
        ],
        name: 'Aero Digital Thermometer',
        discountPrice: '2',
        price: '4',
        percentageOff: 50,
        packageSizes: [],
        brand: 'N95 Masks & Sanitizers',
        manufacturer: 'Hermant Surgical Industries Ltd',
    },
];

const AvailableProductsScreen = () => {

    const navigation = useNavigation();

    const [state, setState] = useState({
        sortBySheet: false,
        currentSortIndex: 0,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        sortBySheet,
        currentSortIndex,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 7.0, }}
                >
                    {delivertoInfo()}
                    {products()}
                </ScrollView>
                {sortAndFilterButton()}
            </View>
            {sortByBottomSheet()}
        </View>
    )

    function sortByBottomSheet() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={sortBySheet}
                onRequestClose={() => {
                    updateState({ sortBySheet: false })
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        updateState({ sortBySheet: false })
                    }}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View style={{ justifyContent: "flex-end", flex: 1 }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                            style={{ backgroundColor: Colors.whiteColor }}
                        >
                            <View style={{ backgroundColor: Colors.whiteColor, }}>
                                <Text style={{ paddingVertical: Sizes.fixPadding - 5.0, ...Fonts.primaryColor19Medium, textAlign: 'center' }}>
                                    SORT BY
                                </Text>
                                <View style={{
                                    backgroundColor: Colors.bodyBackColor, height: 1.0,
                                    marginHorizontal: Sizes.fixPadding,
                                    marginBottom: Sizes.fixPadding + 5.0,
                                }} />
                                {sortByOptions({ index: 1, sortBy: 'Popularity' })}
                                {sortByOptions({ index: 2, sortBy: 'Price -- Low to High' })}
                                {sortByOptions({ index: 3, sortBy: 'Price -- High to Low' })}
                                {sortByOptions({ index: 4, sortBy: 'Discount' })}
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    function sortByOptions({ index, sortBy }) {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => updateState({ currentSortIndex: index, sortBySheet: false })}
                style={{ flexDirection: 'row', marginBottom: Sizes.fixPadding + 10.0, marginHorizontal: Sizes.fixPadding * 4.0, alignItems: 'center' }}>
                <View style={{
                    ...styles.radioButtonStyle,
                    borderColor: currentSortIndex == index ? Colors.primaryColor : 'gray',
                }}>
                    {currentSortIndex == index
                        ?
                        <View style={{ backgroundColor: Colors.primaryColor, width: 10.0, height: 10.0, borderRadius: 5.0 }} />
                        :
                        null
                    }
                </View>
                <Text style={{ marginLeft: Sizes.fixPadding + 10.0, ...Fonts.primaryColor17Regular }}>
                    {sortBy}
                </Text>
            </TouchableOpacity>
        )
    }

    function sortAndFilterButton() {
        return (
            <View style={styles.sortAndFilterButtonWrapStyle}>
                <View style={styles.sortAndFilterButtonStyle}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => updateState({ sortBySheet: true })}
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="sort" size={24} color={Colors.primaryColor} />
                        <Text style={{ paddingLeft: Sizes.fixPadding - 2.0, ...Fonts.primaryColor18Medium }}>
                            Sort
                        </Text>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: Colors.primaryColor, marginVertical: Sizes.fixPadding, height: 32.0, width: 1.5 }} />
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => navigation.push('filter/filterScreen')}
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <MaterialIcons name="filter-list" size={24} color={Colors.primaryColor} />
                        <Text style={{ paddingLeft: Sizes.fixPadding - 2.0, ...Fonts.primaryColor18Medium }}>
                            Filter
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function products() {
        return (
            <>
                {availableProductsList.map((item) => (
                    <View key={`${item.id}`}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => navigation.push('productDescription/productDescriptionScreen', { item: JSON.stringify(item), from: 'availableProduct' })}
                            style={{ flexDirection: 'row', marginHorizontal: Sizes.fixPadding * 2.0, alignItems: 'center', }}
                        >
                            <Image
                                source={item.image}
                                style={{ width: 70.0, height: 70.0, }}
                                resizeMode="contain"
                            />
                            <View style={{ paddingLeft: Sizes.fixPadding, }}>
                                <Text style={{
                                    ...Fonts.primaryColor18Medium, width: width - 130,
                                    lineHeight: 23.0,
                                    paddingTop: Sizes.fixPadding - 5.0,
                                }}>
                                    {item.name}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...Fonts.primaryColor22Medium, }}>
                                        ${item.discountPrice}
                                    </Text>
                                    <Text style={{ paddingHorizontal: Sizes.fixPadding, textDecorationLine: 'line-through', ...Fonts.primaryColor17Light }}>
                                        ${item.price}
                                    </Text>
                                    <View style={styles.offerWrapStyle}>
                                        <Text style={{ ...Fonts.whiteColor16Medium }}>
                                            {item.percentageOff}% OFF
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View
                            style={{ marginVertical: Sizes.fixPadding + 10.0, backgroundColor: Colors.bodyBackColor, height: 1.5, }}
                        />
                    </View>
                ))}
            </>
        )
    }

    function delivertoInfo() {
        return (
            <View style={styles.deliverToInfoWrapStyle}>
                <View style={{ flexDirection: 'row' }}>
                    <MaterialCommunityIcons
                        name="map-marker"
                        style={{ paddingTop: Sizes.fixPadding - 3.0 }}
                        size={20}
                        color={Colors.primaryColor}
                    />
                    <View style={{ marginLeft: Sizes.fixPadding }}>
                        <Text style={{ ...Fonts.primaryColor15Light }}>
                            Deliver To
                        </Text>
                        <Text style={{ ...Fonts.primaryColor18Medium }}>
                            99501 Anchorage
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.push('chooseLocation/chooseLocationScreen')}
                >
                    <Text style={{ ...Fonts.primaryColor18Medium, alignSelf: 'flex-end' }}>
                        Change
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name="arrow-back"
                        size={24}
                        color={Colors.whiteColor}
                        onPress={() => navigation.pop()}
                    />
                    <Text style={{
                        width: width / 1.7,
                        marginLeft: Sizes.fixPadding + 5.0,
                        ...Fonts.whiteColor19Medium
                    }}>
                        Available Product
                    </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <MaterialIcons
                        name="search"
                        size={26}
                        color={Colors.whiteColor}
                        onPress={() => navigation.push('search/searchScreen')}
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
                            <Text style={{ ...Fonts.whiteColor15Regular, lineHeight: 21 }}>
                                1
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.primaryColor,
        height: 56.0,
        paddingLeft: Sizes.fixPadding * 2.0,
        paddingRight: Sizes.fixPadding,
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
    deliverToInfoWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 5.0,
        backgroundColor: Colors.bodyBackColor,
        marginBottom: Sizes.fixPadding + 5.0,
    },
    offerWrapStyle: {
        backgroundColor: Colors.redColor,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding - 6.0,
        paddingHorizontal: Sizes.fixPadding - 4.0,
    },
    sortAndFilterButtonWrapStyle: {
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding,
        borderTopColor: Colors.bodyBackColor,
        borderTopWidth: 1.0,
    },
    sortAndFilterButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding
    },
    radioButtonStyle: {
        borderWidth: 1.0,
        width: 18.0,
        height: 18.0,
        borderRadius: 9.0,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default AvailableProductsScreen;