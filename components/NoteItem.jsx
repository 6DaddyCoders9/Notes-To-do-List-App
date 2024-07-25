import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const NoteItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="px-4">
      <View className="bg-gray-800 p-4 my-3 rounded-lg shadow-lg">
        <Text className="text-xl font-semibold text-secondary mb-2">
          {item.title}
        </Text>
        <Text className="text-gray-300">
          {item.content || "No content available"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NoteItem;
