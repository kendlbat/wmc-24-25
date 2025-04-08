import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";

const TemperatureConverter = () => {
    const [inputTemp, setInputTemp] = useState("20");
    const [inputUnit, setInputUnit] = useState("c");
    const [outputUnit, setOutputUnit] = useState("f");

    const convertTemperature = () => {
        const temp = parseFloat(inputTemp);
        if (isNaN(temp)) return "Invalid input";

        // Convert to Celsius first
        let celsius;
        switch (inputUnit) {
            case "c":
                celsius = temp;
                break;
            case "f":
                celsius = ((temp - 32) * 5) / 9;
                break;
            case "k":
                celsius = temp - 273.15;
                break;
            default:
                celsius = temp;
        }

        // Convert from Celsius to target unit
        let result;
        switch (outputUnit) {
            case "c":
                result = celsius;
                break;
            case "f":
                result = (celsius * 9) / 5 + 32;
                break;
            case "k":
                result = celsius + 273.15;
                break;
            default:
                result = celsius;
        }

        return `${result.toFixed(2)} °${outputUnit.toUpperCase()}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.converter}>
                <Text style={styles.header}>Temperature Converter</Text>

                <Text style={styles.label}>Temperature</Text>
                <TextInput
                    style={styles.input}
                    value={inputTemp}
                    onChangeText={setInputTemp}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>From</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={inputUnit}
                        onValueChange={(itemValue) => setInputUnit(itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#000000"
                        mode="dropdown"
                    >
                        <Picker.Item label="Celsius (°C)" value="c" />
                        <Picker.Item label="Fahrenheit (°F)" value="f" />
                        <Picker.Item label="Kelvin (K)" value="k" />
                    </Picker>
                </View>

                <Text style={styles.label}>To</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={outputUnit}
                        onValueChange={(itemValue) => setOutputUnit(itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#000000"
                        mode="dropdown"
                    >
                        <Picker.Item label="Celsius (°C)" value="c" />
                        <Picker.Item label="Fahrenheit (°F)" value="f" />
                        <Picker.Item label="Kelvin (K)" value="k" />
                    </Picker>
                </View>

                <Text style={styles.output}>{convertTemperature()}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f3f3",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    converter: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 8,
        width: "100%",
        maxWidth: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: "#555",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        paddingHorizontal: 12,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        marginBottom: 20,
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    picker: {
        width: "100%",
        height: 50,
        color: "#333",
    },
    output: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        color: "#2c3e50",
    },
});

export default TemperatureConverter;
