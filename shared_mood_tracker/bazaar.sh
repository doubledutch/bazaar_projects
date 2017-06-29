#!/usr/bin/env bash
date
echo 'shared_mood_tracker'
yarn install | npm install
git clone https://github.com/doubledutch/bazaar-sample.git tmp
shopt -s dotglob && mv tmp/* ./
cd tmp
node ../node_modules/react-native-cli/index.js init shared_mood_tracker --version react-native@0.40.0
cd ..
mkdir mobile
mkdir mobile/ios
mv tmp/shared_mood_tracker/ios/* mobile/ios/
mkdir mobile/android
mv tmp/shared_mood_tracker/android/* mobile/android/
cd mobile
ln -h ../bazaar.json
sed -i '' 's/bazaar_sample/shared_mood_tracker/' package.json
sed -i '' 's/bazaar_sample/shared_mood_tracker/' index.ios.js
sed -i '' 's/bazaar_sample/shared_mood_tracker/' index.android.js
sed -i '' 's/bazaar_sample/shared_mood_tracker/' index.web.js
yarn install | npm install
rm -rf node_modules/bazaar-client/node_modules/react-native/
echo 'Fixing up xcode to use DD packager'
sed -i.bak s/node_modules\\/react-native\\/packager/node_modules\\/dd-rn-packager\\/react-native\\/packager/g ios/shared_mood_tracker.xcodeproj/project.pbxproj
sed -i.bak s/packager\\/launchPackager.command/..\\/dd-rn-packager\\/react-native\\/packager\\/launchPackager.command/g node_modules/react-native/React/React.xcodeproj/project.pbxproj
cd ..
rm -rf tmp
echo Installing dependencies
pushd mobile
yarn install | npm install
popd
pushd web/admin
yarn install | npm install
popd
pushd web/attendee

popd
date
