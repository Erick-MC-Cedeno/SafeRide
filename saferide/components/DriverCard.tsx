import React from "react";
import { TouchableOpacity, Image, Text, View } from "react-native";

interface DriverCardProps {
  item: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string;
    car_image_url: string;
    car_seats: number;
    rating: string;
  };
  selected: boolean;
  setSelected: () => void;
}

const DriverCard = ({ item, selected, setSelected }: DriverCardProps) => {
  return (
    <TouchableOpacity
      onPress={setSelected}
      style={{
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? "blue" : "gray",
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
      }}
    >
      <Image
        source={{ uri: item.profile_image_url }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontWeight: "bold" }}>
          {item.first_name} {item.last_name}
        </Text>
        <Text>Rating: {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DriverCard;