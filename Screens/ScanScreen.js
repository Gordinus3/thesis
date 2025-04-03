import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert } from "react-native";
import Zeroconf from "react-native-zeroconf";

const zeroconf = new Zeroconf();

const ScanScreen = () => {
  const [availableDevices, setAvailableDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const allowedHostnames = ["192.168.5.95"]; // Your Pi hostname

  useEffect(() => {
    console.log("Setting up Zeroconf listeners...");

    // Cleanup previous listeners to avoid conflicts
    zeroconf.removeDeviceListeners();

    // Setting up event listeners before scanning
    zeroconf.on("resolved", (service) => {
      console.log("Service resolved: ", service);
      if (allowedHostnames.includes(service.host)) {
        setAvailableDevices((prev) => [...prev, {
          id: service.name,
          name: service.name,
          ip: service.addresses[0],
        }]);
      }
    });

    zeroconf.on("error", (error) => {
      console.error("Zeroconf Error: ", error);
    });

    zeroconf.on("update", () => {
      const devices = zeroconf.getServices();
      console.log("Devices found: ", devices);
      const detectedDevices = Object.keys(devices).map((key) => ({
        id: key,
        name: devices[key].name,
        ip: devices[key].addresses[0] || "Unknown IP",
      }));
      setAvailableDevices(detectedDevices);
    });

    return () => {
      zeroconf.stop(); // Cleanup when component unmounts
      zeroconf.removeDeviceListeners(); // Remove listeners to avoid memory leaks
    };
  }, []);

  const scanForDevices = () => {
    console.log("Scanning for devices...");
    setAvailableDevices([]); // Clear previous results

    // Make sure to stop any previous scans before starting a new one
    zeroconf.stop();
    zeroconf.removeDeviceListeners(); // Clean listeners to avoid conflicts
    zeroconf.scan(); // Start scanning for mDNS devices
  };

  const connectToDevice = (device) => {
    if (connectedDevice) {
      Alert.alert("Already Connected", `Disconnect from ${connectedDevice.name} first.`);
      return;
    }
    setConnectedDevice(device);
    Alert.alert("Connected", `Connected to ${device.name} (${device.ip})`);
  };

  const disconnectDevice = () => {
    setConnectedDevice(null);
    Alert.alert("Disconnected", "You have disconnected from the Raspberry Pi.");
  };

  return (
    <View style={{ padding: 20 }}>
      <View style={{alignItems:"center"}}>      
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>Available Devices</Text>
      </View>

      <Button title="Scan for Devices" onPress={scanForDevices} />

      <FlatList
        data={availableDevices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 18 }}>{item.name} ({item.ip})</Text>
            {!connectedDevice || connectedDevice.id !== item.id ? (
              <Button title="Connect" onPress={() => connectToDevice(item)} disabled={!!connectedDevice} />
            ) : (
              <Button title="Disconnect" onPress={disconnectDevice} color="red" />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default ScanScreen;
