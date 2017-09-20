#!/usr/bin/env bash
date
echo 'webview_search'
yarn install
git clone https://github.com/doubledutch/bazaar-sample.git tmp
rm -rf tmp/.git
shopt -s dotglob && mv tmp/* ./
cd tmp
node ../node_modules/react-native-cli/index.js init webview_search --version react-native@0.46.4
cd ..
mkdir mobile
mkdir mobile/ios
mv tmp/webview_search/ios/* mobile/ios/
mkdir mobile/android
mv tmp/webview_search/android/* mobile/android/
mv bazaar.json mobile/bazaar.json
cd mobile
sed -i '' 's/bazaar_sample/webview_search/' package.json
sed -i '' 's/bazaar_sample/webview_search/' index.ios.js
sed -i '' 's/bazaar_sample/webview_search/' index.android.js
sed -i '' 's/bazaar_sample/webview_search/' index.web.js
yarn install
rm -rf node_modules/bazaar-client/node_modules/react-native/
echo 'Fixing up xcode to use DD packager'
sed -i.bak s/node_modules\\/react-native\\/packager/node_modules\\/dd-rn-packager\\/react-native\\/packager/g ios/webview_search.xcodeproj/project.pbxproj
sed -i.bak s/packager\\/launchPackager.command/..\\/dd-rn-packager\\/react-native\\/packager\\/launchPackager.command/g node_modules/react-native/React/React.xcodeproj/project.pbxproj
cd ..
echo rm -rf tmp
echo Installing dependencies
pushd mobile
yarn install
echo Adding react-native-camera...
yarn add react-native-camera
echo Linking react-native-camera...
node node_modules/react-native/local-cli/cli.js link react-native-camera
echo Adding react-native-fetch-blob...
yarn add react-native-fetch-blob
echo Linking react-native-fetch-blob...
node node_modules/react-native/local-cli/cli.js link react-native-fetch-blob
echo Adding react-native-video...
yarn add react-native-video
echo Linking react-native-video...
node node_modules/react-native/local-cli/cli.js link react-native-video
echo Adding react-native-youtube...
yarn add react-native-youtube
echo Linking react-native-youtube...
node node_modules/react-native/local-cli/cli.js link react-native-youtube
popd
pushd web/admin

popd
pushd web/attendee

popd
date
