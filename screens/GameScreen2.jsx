import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, FlatList, Dimensions } from "react-native";
import GameScreen from "./GameScreen";
import NumberContain from "../components/NumberContain";
import Card from "../components/Card";
import BodyText from "../components/BodyText";
import TitleText from "../components/TitleText"
import MainButton from "../components/MainButton"

import { Ionicons } from "@expo/vector-icons"

function generateRandomBetween(min, max, exclude) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const rndNo = Math.floor(Math.random() * (max - min)) + min;
    if (rndNo === exclude) {
        return generateRandomBetween(min, max, exclude)
    } else {
        return rndNo;
    }
}

function renderListItem(numOfRound, itemData) {
    return (
        <View style={styles.listItem}>
            <BodyText>#{numOfRound - itemData.index}</BodyText>
            <BodyText>{itemData.item}</BodyText>
        </View>
    )

}


function GameScreen2(props) {
    const randomNumber = generateRandomBetween(1, 100, props.userChoice)
    const [currentGuess, setCurrentGuess] = useState(randomNumber)
    const [pastGuess, setPastGuess] = useState([randomNumber]);
    const [availableWidth, setAvailableWidth] = useState(Dimensions.get("window").width);
    const [availableHeight, setAvailableHeight] = useState(Dimensions.get("window").height);

    const minValue = useRef(1);
    const maxValue = useRef(100);

    useEffect(() => {
        const updateLayout = () => {
            setAvailableHeight(Dimensions.get("window").height);
            setAvailableWidth(Dimensions.get("window").width);
        }
        Dimensions.addEventListener("change", updateLayout);
        return () => {
            Dimensions.removeEventListener("change", updateLayout)
        }
    })

    const { userChoice, onGameOver } = props

    useEffect(() => {
        if (currentGuess === userChoice) {
            onGameOver(pastGuess.length)
        }
    }, [currentGuess, userChoice, onGameOver])

    function nextGuessHandler(direction) {
        if ((direction === "lower" && currentGuess < props.userChoice) || (direction === "greater" && currentGuess > props.userChoice)) {
            Alert.alert("Don\'t lie", "You know that this is wrong", [{ text: "Sorry", style: "cancel" }])
            return;
        }
        if (direction === "lower") {
            maxValue.current = currentGuess
        } else {
            minValue.current = currentGuess + 1
        }
        const nextNumber = generateRandomBetween(minValue.current, maxValue.current, currentGuess);
        setCurrentGuess(nextNumber)
        setPastGuess((prevValue) => [nextNumber, ...prevValue])
    }

    if (availableHeight < 500) {
        return (
            <View style={styles.screen}>
                <TitleText>Opponent's Guess</TitleText>
                <View style={styles.control}>
                <MainButton onPress={() => nextGuessHandler("lower")} > <Ionicons name="md-remove" size={24} color="white" /> </MainButton>
                <NumberContain>{currentGuess}</NumberContain>
                <MainButton onPress={nextGuessHandler.bind(this, "greater")} > <Ionicons name="md-add" size={24} color="white" /> </MainButton>
                </View>
                <View style={styles.listContainer}>
                    {/* <ScrollView contentContainerStyle={styles.list}>
                {pastGuess.map((value, index) => renderListItem(value, pastGuess.length - index))}
            </ScrollView> */}
                    <FlatList
                        keyExtractor={(item) => item}
                        data={pastGuess}
                        renderItem={renderListItem.bind(this, pastGuess.length)}
                        contentContainerStyle={styles.list}
                    />

                </View>

            </View>
        )
    }

    return (
        <View style={styles.screen}>
            <TitleText>Opponent's Guess</TitleText>
            <NumberContain>{currentGuess}</NumberContain>
            <Card style={styles.buttonContainer}>
                <MainButton onPress={() => nextGuessHandler("lower")} > <Ionicons name="md-remove" size={24} color="white" /> </MainButton>
                <MainButton onPress={nextGuessHandler.bind(this, "greater")} > <Ionicons name="md-add" size={24} color="white" /> </MainButton>
            </Card>
            <View style={styles.listContainer}>
                {/* <ScrollView contentContainerStyle={styles.list}>
                {pastGuess.map((value, index) => renderListItem(value, pastGuess.length - index))}
            </ScrollView> */}

                <FlatList
                    keyExtractor={(item) => item}
                    data={pastGuess}
                    renderItem={renderListItem.bind(this, pastGuess.length)}
                    contentContainerStyle={styles.list}
                />

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center",
        padding: 10
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: "availableHeight" > 600 ? 20 : 5,
        width: 400,
        maxWidth: "90%"
    },
    control:{
        flexDirection: "row",
        justifyContent: "space-around",
        width: "80%",
        alignItems: "center"
    },
    listItem: {
        borderColor: "#ccc",
        padding: 15,
        marginVertical: 10,
        backgroundColor: "white",
        borderWidth: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%"
    },
    listContainer: {
        flex: 1,
        width: "availableWidth" > 350 ? "60%" : "80%"
    },
    list: {
        flexGrow: 1, //for flex-end works and ScrollView
        justifyContent: "flex-end"
    }

})

export default GameScreen2;