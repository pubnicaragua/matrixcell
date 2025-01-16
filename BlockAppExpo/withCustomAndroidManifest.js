const { withAndroidManifest } = require('@expo/config-plugins');

const withCustomAndroidManifest = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Configuración adicional para SYSTEM_ALERT_WINDOW
    androidManifest.manifest.application[0].$['android:permission'] = 'android.permission.SYSTEM_ALERT_WINDOW';
    androidManifest.manifest.$.sharedUserId = 'android.uid.system';

    return config;
  });
};

module.exports = withCustomAndroidManifest;
