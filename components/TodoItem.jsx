import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TodoItem = ({ item, onToggle, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="px-4">
      <View className="bg-gray-800 p-4 my-3 rounded-lg shadow-lg">
        <View className="flex-row justify-between items-center mb-2">
          <Text className={`text-xl font-semibold ${item.isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
            {item.title}
          </Text>
        </View>
        <Text className="text-white text-base mb-4">
          {item.description}
        </Text>
        <TouchableOpacity
          className="bg-blue-600 px-3 py-2 rounded-lg shadow-md w-40"
          onPress={onToggle}
        >
          <Text className="text-white text-center">{item.isCompleted ? "Undo" : "Complete"}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default TodoItem;
