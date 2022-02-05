import axios from 'axios';
import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';
import RNLocation from 'react-native-location';

RNLocation.configure({
  distanceFilter: null,
});

const App = () => {
  const [viewLocation, setViewLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [showCountryCode, setShowCountryCode] = useState(false);

  const permissionsHandle = async () => {
    const permission = await RNLocation.checkPermission({
      ios: 'whenInUse',
      android: {
        detail: 'coarse',
      },
    });

    if (!permission) {
      await RNLocation.requestPermission({
        ios: 'whenInUse',
        android: {
          detail: 'coarse',
          rationale: {
            title: 'We need access to your location',
            message: 'We use your location in this app',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        },
      });
    }

    const location = await RNLocation.getLatestLocation({timeout: 100});
    setViewLocation(location);
    // console.log(location);

    await axios
      .get(
        `http://api.positionstack.com/v1/reverse?access_key=a269a2ea004b9c10555119568f5c54ee&query=${location.latitude},${location.longitude}`,
      )
      .then(response => {
        setAddress(response.data);
      });
  };

  console.log(address);

  return (
    <View>
      <Text>Latitude: {viewLocation?.latitude}</Text>
      <Text>Longitude: {viewLocation?.longitude}</Text>
      <Text>Name: {address && address.data[0].name}</Text>
      <Text>Country: {address && address.data[0].country}</Text>
      {showCountryCode && (
        <Text>Country code: {address && address.data[0].country_code}</Text>
      )}
      <Button title="Get location" onPress={permissionsHandle} />
      <Button
        title="Show country code"
        onPress={() => setShowCountryCode(!showCountryCode)}
      />
    </View>
  );
};

export default App;
