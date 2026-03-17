import getDistance from "geolib/es/getPreciseDistance";
import { Text, View, Linking, Alert, Button } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Link } from "expo-router";
import * as Notifications from "expo-notifications";



type Coordinate = {
  latitude: number;
  longitude: number;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


export default function Index() {

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [hasBeenNotified, setHasBeenNotified] = useState(false);

  
  const eventLat = 32.7840;
  const eventLng = -79.9360;

  

  useEffect(() => {
    (async () => {
      await Notifications.requestPermissionsAsync();

      let {status} = await Location.requestForegroundPermissionsAsync();

      if (status != "granted"){
        setHasPermission(false);
        Alert.alert(
          "Permission Denied",
          "Please allow location access in settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Go to Settings", onPress: () => Linking.openSettings() }
          ]
        );
      } else {
        setHasPermission(true);
      }
      
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
        },

        (location) => {
          const userLat = location.coords.latitude;
          const userLng = location.coords.longitude;


          setUserLocation({
            latitude: userLat,
            longitude: userLng
          })

           // Inside your Location.watchPositionAsync callback:
          const distanceToEvent = getDistance(
            { latitude: userLat, longitude: userLng },
            { latitude: eventLat, longitude: eventLng },
          );

          
        
          if (distanceToEvent <= 100 && !hasBeenNotified) {
            setHasBeenNotified(true);

            Notifications.scheduleNotificationAsync({
              content: {
                title: "Nearby Event!",
                body: "You are within 100 meters.",
                data: {
                  latitude: eventLat,
                  longitude: eventLng
                }
              },
              trigger: null
            });    
            
            
            
          }
        }
      );
      
      


    }) ();
  }, []) 
  
 


  return (
    <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 50,
      backgroundColor: "#800000"
    }}
  >

    <Text style={{ fontSize: 24, fontWeight: "bold", color:"white", textAlign: "center"}}>
      College Of Charlestion Event Tracker
    </Text>

    <Text style={{color:"white"}}>
      Current Events Happening Around the CofC Campus
    </Text>

    <Link href="/map" asChild>
      <Button title = "Campus Map" />
    </Link>

    

  </View>
   
  );
}
