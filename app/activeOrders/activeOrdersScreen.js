import React from "react";
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, FlatList } from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../component/myStatusBar";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get('screen');

const ordersList = [
    {
        id: '1',
        image: require('../../assets/images/deal_of_the_day/deal_of_the_day_2.png'),
        name: 'Garlic Pearls - Natural Way To Healthy Heart & Digestion - 100s',
        arriving: '29 Aug, 2020',
    },
];

const ActiveOrdersScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor, }}>
            <MyStatusBar />
            <View style={{ flex: 1, }}>
                {header()}
                {orders()}
            </View>
        </View>
    )

    function orders() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.push('trackOrder/trackOrderScreen', { item: JSON.stringify(item) })}
                style={{
                    backgroundColor: Colors.whiteColor,
                    flexDirection: 'row',
                    padding: Sizes.fixPadding * 2.0,
                }}
            >
                <Image
                    source={item.image}
                    style={{ width: 100.0, height: 100.0, }}
                    resizeMode="contain"
                />
                <View style={{ paddingTop: Sizes.fixPadding - 8.0, marginLeft: Sizes.fixPadding, width: width - 150, }}>
                    <Text style={{ lineHeight: 24.0, ...Fonts.primaryColor18Medium }}>
                        {item.name}
                    </Text>
                    <Text style={{ ...Fonts.grayColor17Regular }}>
                        Arriving: {item.arriving}
                    </Text>
                    <View style={{ marginVertical: Sizes.fixPadding - 4.0, backgroundColor: Colors.grayColor, height: 1.0, }} />
                    <Text style={{ textAlign: 'right', ...Fonts.primaryColor20Medium }}>
                        TRACK ORDER
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <FlatList
                data={ordersList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
            />
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color={Colors.whiteColor}
                    onPress={() => navigation.pop()}
                />
                <Text style={{ marginLeft: Sizes.fixPadding + 5.0, ...Fonts.whiteColor19Medium }}>
                    Active Orders
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        backgroundColor: Colors.primaryColor,
        height: 56.0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding,
    }
});

export default ActiveOrdersScreen;