import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const code = `
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

const String serverName = "https://arduino.iotaquaculture.com/send-data?secret=SECRET_CODE";

void setup() {
Serial.begin(115200);
WiFi.begin(ssid, password);
while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
}
}

void loop() {
if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"temperature\": 25.3, \"humidity\": 40}";
    int responseCode = http.POST(payload);
    http.end();
}
delay(10000); 
//Send Data when new data availabe
//don't post data if data not changed
}`

export default function ConnectArduinoScreen() {
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(code);
        ToastAndroid.show("Code copied to clipboard", ToastAndroid.SHORT);
    };
    return (
        <ScrollView contentContainerStyle={styles.container} className='bg-white py-5'>
            <Text style={styles.header}>🔧 Connect Your Arduino</Text>

            <Text style={styles.subheader}>Step 1: Hardware Requirements</Text>
            <Text style={styles.text}>
                • Arduino board with Wi-Fi (e.g., ESP8266, ESP32){'\n'}
                • Arduino IDE installed on your computer{'\n'}
                • Active Wi-Fi connection
            </Text>

            <Text style={styles.subheader}>Step 2: Upload This Code</Text>
            <Text className='text-gray-500'>
                API LINK:
            </Text>
            <Text className='text-red-500 pb-5'>
                https://arduino.iotaquaculture.com/send-data?secret=SECRET_CODE
            </Text>
            <View className='relative' style={styles.code}>
                <TouchableOpacity onPress={copyToClipboard} className=' bg-gray-200 p-2 rounded'>
                    <Text className='text-blue-500 text-center'><FontAwesome name='copy' /> Copy Code</Text>
                </TouchableOpacity>
                <Text className='font-semibold'>
                    
                    {code}
                </Text>
            </View>


            <Text style={styles.subheader}>Step 3: View Live Data</Text>
            <Text style={styles.text}>
                After uploading the code, your Arduino will begin sending sensor data to our server.
                {'\n\n'}Go to the “📊 Home Screen to view your readings in real time!
            </Text>

            <Text style={styles.subheader}>Troubleshooting</Text>
            <Text style={styles.text}>
                • Ensure your Wi-Fi credentials are correct.Change YOUR_WIFI_PASSWORD YOUR_WIFI_SSID with actual values{'\n'}
                • Use a secure `https://` endpoint in the Arduino code.{'\n'}
                • Your board must be able to access the internet.
                • You must replace SECRET_CODE with your secret code
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    subheader: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
        color: '#444',
    },
    code: {
        fontSize: 14,
        fontFamily: 'Courier',
        backgroundColor: '#f4f4f4',
        padding: 10,
        borderRadius: 6,
        color: '#222',
    },
});
