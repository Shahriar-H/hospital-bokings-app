import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const code = `
#include <WebSocketsClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

WebSocketsClient webSocket;

void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  if (type == WStype_TEXT) {
    // Print raw payload
    Serial.println((char*)payload);

    // Allocate memory for JSON document
    StaticJsonDocument<256> doc;

    // Parse the JSON from payload
    DeserializationError error = deserializeJson(doc, payload);
    if (error) {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
      return;
    }

    // Example: assume JSON is like {"BUTTON_NAME": 123}
    int value = doc["BUTTON_NAME"];  // Extract the "button" field
    Serial.print("Extracted value: ");
    Serial.println(value);
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin("SSID", "PASSWORD");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi");

  // Connect to secure WebSocket server
  webSocket.beginSSL("arduino.iotaquaculture.com", 443, "/");

  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
}
`

export default function ConnectArduinoScreen() {
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(code);
        ToastAndroid.show("Code copied to clipboard", ToastAndroid.SHORT);
    };
    return (
        <ScrollView contentContainerStyle={styles.container} className='bg-white py-5'>
            <Text style={styles.header}>🔧 Connect Your Device</Text>

            <Text style={styles.subheader}>Step 1: Hardware Requirements</Text>
            <Text style={styles.text}>
                • Device board with Wi-Fi (e.g., ESP8266, ESP32){'\n'}
                • Arduino IDE installed on your computer{'\n'}
                • Active Wi-Fi connection
            </Text>

            <Text style={styles.subheader}>Step 2: Upload This Code</Text>
            {/* <Text className='text-gray-500'>
                API LINK:
            </Text>
            <Text className='text-red-500 pb-5'>
                https://arduino.iotaquaculture.com/send-data?secret=SECRET_CODE
            </Text> */}
            <View className='relative' style={styles.code}>
                <TouchableOpacity onPress={copyToClipboard} className=' bg-gray-200 p-2 rounded'>
                    <Text className='text-blue-500 text-center'><FontAwesome name='copy' /> Copy Code</Text>
                </TouchableOpacity>
                <Text className='font-semibold'>
                    
                    {code}
                </Text>
            </View>


            
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
