import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from "react-native";
import { Colors, Sizes, Fonts } from "../../constant/styles";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import MyStatusBar from "../../component/myStatusBar";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get('screen');

const offersList = [
    {
        id: '1',
        image: require('../../assets/images/offer_icon/amazon_pay.png'),
        title: 'Additional cashback upto $5 on Amazon Pay | No coupon required',
        description: 'Pay via Amazon Pay and get Min $1 to Max $5 cashbac, Valid on min. transaction of $3.',
        expireDate: '31/08/2020',
    },
    {
        id: '2',
        image: require('../../assets/images/offer_icon/hsbc.jpg'),
        title: '5% cashback on HSBC Credit card | No coupon code required',
        description: '5% additional cashback up to $3 on payment made via HSBC Credit card on a minimum transaction of $10',
        expireDate: '30/08/2020',
    },
];

const OffersScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                {offers()}
            </View>
        </View>
    )

    function offers() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.push('offerDetail/offerDetailScreen')}
                style={styles.offersWrapStyle}
            >
                <View style={styles.offerProviderWrapStyle}>
                    <Image
                        source={item.image}
                        style={{ width: 60.0, height: 60.0, marginBottom: Sizes.fixPadding * 4.0 }}
                        resizeMode="contain"
                    />
                    <FontAwesome5 name="percent" size={25} color='#663D00' />
                </View>
                <View style={styles.offerDetailWrapStyle}>
                    <Text style={{ paddingTop: Sizes.fixPadding - 8.0, ...Fonts.blackColor19Medium, lineHeight: 23.0, }}>
                        {item.title}
                    </Text>
                    <Text style={{ paddingTop: Sizes.fixPadding - 5.0, ...Fonts.grayColor18Regular, lineHeight: 23.0, }}>
                        {item.description}
                    </Text>
                    <Text style={{ ...Fonts.grayColor18Regular }}>
                        Expires On {item.expireDate}
                    </Text>
                    <View style={{ marginTop: Sizes.fixPadding - 5.0, backgroundColor: Colors.grayColor, height: 1.0, }} />
                    <Text style={{ paddingTop: Sizes.fixPadding, ...Fonts.primaryColor19Medium, textAlign: 'right' }}>
                        VIEW DETAILS
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <FlatList
                data={offersList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{ paddingVertical: Sizes.fixPadding * 2.0 }}
            />
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
                    <Text style={{ ...Fonts.whiteColor19Medium, marginLeft: Sizes.fixPadding + 5.0 }}>
                        Notifications
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
                            <Text style={{ ...Fonts.whiteColor15Regular,lineHeight:21 }}>
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
    cartItemCountWrapStyle: {
        position: 'absolute',
        right: -8.0,
        height: 17.0,
        width: 17.0,
        borderRadius: 8.5,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: Colors.redColor,
        elevation: 10.0,
    },
    headerWrapStyle: {
        backgroundColor: Colors.primaryColor,
        height: 56.0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: Sizes.fixPadding * 2.0,
        paddingRight: Sizes.fixPadding,
    },
    offersWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.grayColor,
        borderWidth: 0.50,
        borderRadius: Sizes.fixPadding,
        flexDirection: 'row',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding + 5.0,
    },
    offerProviderWrapStyle: {
        backgroundColor: Colors.orangeColor,
        justifyContent: 'space-between',
        paddingTop: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingBottom: Sizes.fixPadding * 5.0,
        borderTopLeftRadius: Sizes.fixPadding,
        borderBottomLeftRadius: Sizes.fixPadding,
        alignItems: 'center',
    },
    offerDetailWrapStyle: {
        width: width - 170.0,
        marginVertical: Sizes.fixPadding + 5.0,
        marginHorizontal: Sizes.fixPadding + 5.0,
        backgroundColor: Colors.whiteColor,
    }
});

export default OffersScreen;