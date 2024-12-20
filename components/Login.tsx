import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView, TextInput, Button, Text, View } from "react-native";
import WebView from "react-native-webview";
import styles from "./styles";

interface AppProps {
  setToken: (token: string) => void;
}

const App: React.FC<AppProps> = ({ setToken }) => {
  const webViewRef = useRef(null);

  const handleToken = (newData: string) => {
    const parsedData = JSON.parse(newData);
    console.log(parsedData["access_token"]);
    setToken(parsedData["access_token"]);
  };

  const injectedJavaScript = `
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    this.addEventListener('readystatechange', () => {
      if (this.readyState === 4 && this.status === 200 && url === 'https://mborijnland.osiris-student.nl:443/student/osiris/token') {  // Проверяем, что запрос успешно завершился
        window.ReactNativeWebView.postMessage(this.responseText);
      }
    });
    originalXHROpen.apply(this, arguments);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.querySelector('input#userNameInput');
    if (emailInput) {
      emailInput.addEventListener('input', (event) => {
        const value = emailInput.value;
        if (value.includes('@') && !value.includes('@mborijnland.nl')) {
          emailInput.value = value.split('@')[0] + '@mborijnland.nl';
        }
      });
    }
  });
`;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: "https://mborijnland.osiris-student.nl/home" }}
        onMessage={(event: any) => {
          handleToken(event.nativeEvent.data);
        }}
        injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
        javaScriptEnabled={true}
        incognito={true}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

export default App;
