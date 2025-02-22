import React, { useState } from "react";
import { View, Modal, ScrollView, TouchableWithoutFeedback, Text, StyleSheet, Dimensions, Image, TouchableOpacity, } from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MyStatusBar from "../../component/myStatusBar";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get('screen');

const previouslyBoughtItemsList = [
    {
        id: '1',
        image: require('../../assets/images/handpicked_item/handpicked_item_5.png'),
        name: 'Revital H Health Supplement Capsules Bottle of 30',
        manufacturer: 'REVITAL',
        detail: '30 CAPSULES(S) IN BOTTLE',
        discountPrice: 5,
        price: 6,
        percentageOff: 15,
        qty: 1,
    },
];

const PreviouslyBoughtItemsScreen = () => {

    const navigation = useNavigation();

    const [state, setState] = useState({
        itemsList: previouslyBoughtItemsList,
        quantityDialog: false,
        currentQuantity: null,
        currentItemId: '',
        currentItemIndex: 0,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        itemsList,
        quantityDialog,
        currentQuantity,
        currentItemId,
        currentItemIndex,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 6.0 }}
                >
                    {deliverToInfo()}
                    {items()}
                </ScrollView>
                {continueButton()}
            </View>
            {selectQuantityDialog()}
        </View>
    )

    function continueButton() {
        return (
            <View style={styles.continueButtonWrapStyle}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.push('cart/cartScreen')}
                    style={styles.continueButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor19Medium }}>
                        Continue
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function selectQuantityDialog() {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={quantityDialog}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.selectQuantityModelStyle}>
                        <View style={{
                            width: width * 0.8,
                            backgroundColor: Colors.whiteColor,
                            borderRadius: Sizes.fixPadding,
                        }}>
                            <View style={styles.selectQuantityTitleStyle}>
                                <Text style={{ ...Fonts.primaryColor20Medium }}>
                                    Select Quantity
                                </Text>
                                <MaterialIcons name="close" size={24}
                                    onPress={() => updateState({ quantityDialog: false })}
                                    color={Colors.primaryColor} />
                            </View>
                            <View style={{ backgroundColor: Colors.primaryColor, height: 1.0 }} />
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => {
                                    changeQuantity({ quantity: 0 })
                                    updateState({ quantityDialog: false })
                                }}
                            >
                                {
                                    (itemsList[currentItemIndex].qty) == 0 ?
                                        null :
                                        <Text style={{ margin: Sizes.fixPadding, ...Fonts.primaryColor19Medium }}>
                                            Remove item
                                        </Text>
                                }
                            </TouchableOpacity>
                            {quantity({ number: 1, })}
                            {quantity({ number: 2, })}
                            {quantity({ number: 3, })}
                            {quantity({ number: 4, })}
                            {quantity({ number: 5, })}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal >
        )
    }

    function changeQuantity({ quantity }) {
        const newList = itemsList.map((product) => {
            if (product.id === currentItemId) {
                const updatedItem = { ...product, qty: quantity, };
                return updatedItem;
            }
            return product;
        });
        updateState({ itemsList: newList })
    }

    function quantity({ number }) {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                    updateState({ currentQuantity: number })
                    changeQuantity({ quantity: number })
                    updateState({ quantityDialog: false })
                }}
                style={{
                    backgroundColor: currentQuantity == number ? '#E2E2E2' : Colors.whiteColor,
                    borderBottomLeftRadius: number == 5 ? Sizes.fixPadding : 0.0,
                    borderBottomRightRadius: number == 5 ? Sizes.fixPadding : 0.0,
                    ...styles.selectedQuantityWrapStyle,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <Text style={{ ...Fonts.primaryColor19Medium }}>
                        {number}
                    </Text>
                    {number == 5
                        ?
                        <Text style={{ ...Fonts.primaryColor15Light, marginLeft: Sizes.fixPadding }}>
                            Max Qty
                        </Text>
                        :
                        null
                    }
                </View>
                {currentQuantity == number ?
                    <View style={styles.doneIconWrapStyle}>
                        <MaterialIcons name="check" size={20} color={Colors.whiteColor} />
                    </View>
                    :
                    null
                }
            </TouchableOpacity>
        )
    }

    function items() {
        return (
            <View>
                {itemsList.map((item, index) => (
                    <View key={`${item.id}`}>
                        <View style={{
                            backgroundColor: Colors.whiteColor,
                            paddingHorizontal: Sizes.fixPadding * 2.0,
                            paddingVertical: Sizes.fixPadding * 2.0
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    source={item.image}
                                    style={{ width: 50.0, height: 50.0 }}
                                    resizeMode="contain"
                                />
                                <View style={{ marginLeft: Sizes.fixPadding, }}>
                                    <Text style={{ width: width - 100.0, ...Fonts.primaryColor19Medium, lineHeight: 25.0, }}>
                                        {item.name}
                                    </Text>
                                    <Text style={{ ...Fonts.primaryColor18Regular, lineHeight: 23.0, }}>
                                        BY {item.manufacturer}
                                    </Text>
                                    <Text style={{ ...Fonts.primaryColor19Medium }}>
                                        {item.detail}
                                    </Text>
                                    <View style={{ flexDirection: 'row', marginBottom: Sizes.fixPadding, alignItems: 'center' }}>
                                        <Text style={{ ...Fonts.primaryColor25Medium }}>
                                            ${item.discountPrice}
                                        </Text>
                                        <Text style={{ marginHorizontal: Sizes.fixPadding + 2.0, ...Fonts.primaryColor18Light, textDecorationLine: "line-through" }}>
                                            ${item.price}
                                        </Text>
                                        <View style={styles.offerWrapStyle}>
                                            <Text style={{ ...Fonts.whiteColor16Medium }}>
                                                {item.percentageOff}% OFF
                                            </Text>
                                        </View>
                                    </View>
                                    {
                                        item.qty == 0 ?
                                            <TouchableOpacity
                                                activeOpacity={0.6}
                                                onPress={() => updateState({
                                                    quantityDialog: true,
                                                    currentItemId: item.id,
                                                    currentQuantity: item.qty,
                                                    currentItemIndex: index
                                                })}
                                                style={styles.addToCartButtonStyle}
                                            >
                                                <Text style={{ ...Fonts.whiteColor16Medium }}>
                                                    Add to Cart
                                                </Text>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                activeOpacity={0.6}
                                                onPress={() => updateState({
                                                    quantityDialog: true, currentItemId: item.id,
                                                    currentQuantity: item.qty,
                                                    currentItemIndex: index
                                                })}
                                                style={styles.quantityCountWrapStyle}>
                                                <Text style={{ ...Fonts.primaryColor19Medium, marginRight: Sizes.fixPadding - 7.0 }}>
                                                    Qty {item.qty}
                                                </Text>
                                                <MaterialIcons name="arrow-drop-down" size={24} color={Colors.primaryColor} />
                                            </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                ))
                }
            </View>
        )
    }

    function deliverToInfo() {
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

        const totalItems = itemsList.filter((item) => {
            return item.qty > 0
        });

        return (
            <View style={styles.headerWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name="arrow-back"
                        size={24}
                        color={Colors.whiteColor}
                        onPress={() => navigation.pop()}
                    />
                    <Text
                        style={{
                            width: width / 1.7,
                            marginLeft: Sizes.fixPadding + 5.0,
                            ...Fonts.whiteColor19Medium
                        }}
                    >
                        Previously Bought Items
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
                                {totalItems.length}
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
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding + 5.0
    },
    quantityCountWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 8.0,
    },
    offerWrapStyle: {
        backgroundColor: Colors.redColor,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding - 6.0,
        paddingHorizontal: Sizes.fixPadding - 4.0,
    },
    selectedQuantityWrapStyle: {
        paddingVertical: Sizes.fixPadding - 5.0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding + 2.0,
    },
    doneIconWrapStyle: {
        width: 25.0,
        height: 25.0,
        borderRadius: 12.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.redColor
    },
    selectQuantityTitleStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: Sizes.fixPadding * 2.0,
    },
    selectQuantityModelStyle: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.50)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding + 2.0,
        paddingVertical: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    continueButtonWrapStyle: {
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
        backgroundColor: Colors.whiteColor,
        borderTopColor: '#EEEEEE',
        borderTopWidth: 1.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding
    },
    continueButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding,
    }
});

export default PreviouslyBoughtItemsScreen;