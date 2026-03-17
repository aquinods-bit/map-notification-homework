import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect } from "react";
import MapView, {Marker, Callout} from 'react-native-maps';
import { useRef } from "react";
import { useLocalSearchParams } from "expo-router";

type Event = {
  id: number,
  name: string;
  description: string;
  latitude: number;
  longitude: number;

};

const events: Event[] = [
  {
    id: 1, 
    name: "Walmart",
    description: "Shaq is doing a meet n greet.",
    latitude: 32.93402,
    longitude: -80.04120,
  },
  {
    id: 2, 
    name: "Concert at the Campus",
    description: "Live concert on Campus by Weird Al Yankovic",
    latitude: 32.7887,
    longitude: -79.9357,
  },
  {
    id: 3, 
    name: "Parade",
    description: "A fun parade, celebrating things, yay!",
    latitude: 32.7807,
    longitude: -79.9307,
  },
  
  
]

const map = () => {

  const mapRef = useRef<MapView | null>(null);
  
  const {lat, lng} = useLocalSearchParams();
  const latitude = Number(lat);
  const longitude = Number(lng);

  const fitAllEvents = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        events.map(event => ({
          latitude: event.latitude,
          longitude: event.longitude
        })),
      )
    }
  };

  useEffect(() =>  {
    if(isNaN(latitude) && !isNaN(longitude) && mapRef.current){

      mapRef.current.animateToRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

    }
  }, [latitude,longitude]);

  return (
    <View style={styles.container}>
    <MapView 
      ref = {mapRef}
      style={styles.map} 
      showsUserLocation={true}
      initialRegion={{
        latitude: 32.7840, 
        longitude: -79.9360, 
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
          >
            <Callout tooltip={true}>
              <View style={styles.callout}>
                <Text style={styles.title}>{event.name}</Text>
                <Text>{event.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      
    </MapView>

    <View style={styles.buttonContainer}>
        <Button 
        title="Fit All Events" 
        onPress={fitAllEvents} />
      </View>

   

   
  </View>
  );
};

export default map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  callout: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: 200,
  },

  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  
});
