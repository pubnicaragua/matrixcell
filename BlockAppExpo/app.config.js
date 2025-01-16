const withCustomAndroidManifest = require('./withCustomAndroidManifest');

module.exports = {
  expo: {
    name: 'BlockAppExpo',
    slug: 'BlockAppExpo',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      
      package: 'com.dxgabalt.BlockAppExpo',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      './withCustomAndroidManifest',
      'expo-secure-store',
      [
        'expo-system-ui',
        {
          androidNavigationBar: {
            visible: 'lean',
          },
        },
      ],
    ],
    extra: {
      eas: {
        projectId: '9dcbfa90-1c53-425f-942d-cb4f3cdf4816',
      },
    },
  },
};
