import 'react-native-get-random-values';
import 'fast-text-encoding';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { registerGlobals } from './src/lib/livekit';
registerGlobals();

import { Platform } from 'react-native';

if (Platform.OS === 'web') {
    window.addEventListener('error', (event) => {
        document.body.innerHTML = `
            <div style="padding: 40px; background: red; color: white; height: 100vh; font-family: sans-serif;">
                <h1 style="font-size: 32px; font-weight: bold;">CRITICAL WEB CRASH</h1>
                <p style="font-size: 20px; white-space: pre-wrap;">${event.message}</p>
                <p><strong>File:</strong> ${event.filename}</p>
                <p><strong>Line:</strong> ${event.lineno} : ${event.colno}</p>
            </div>
        `;
    });
}

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
