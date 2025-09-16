const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const config = {
    transformer : {
        minifierConfig : {
            keep_fnames: true,
            mangle : {
                keep_fnames: true,
            },
        },
    },
};

module.exports = mergeConfig(defaultConfig, config);
