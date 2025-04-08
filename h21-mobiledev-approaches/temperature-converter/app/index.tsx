import { Text, View } from "react-native";
import TemperatureConverter from "./TemperatureConverter.jsx";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <TemperatureConverter></TemperatureConverter>
        </View>
    );
}
