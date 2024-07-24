import {
  FlatList,
  Text,
  View,
  Image,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import EmptyState from "../../components/EmptyState";
import { fetchTodos, updateTodo, deleteTodo } from "../../lib/appwrite"; // Import your API functions
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import CustomButton from "../../components/CustomButton"; // Import CustomButton component
import InfoBox from "../../components/InfoBox"; // Import InfoBox component

const TodoListPage = () => {
  const { user } = useGlobalContext();
  const [todos, setTodos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTodos = async () => {
    try {
      const fetchedTodos = await fetchTodos();
      setTodos(fetchedTodos);
    } catch (error) {
      Alert.alert("Error", "Failed to load todos");
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTodos();
    setRefreshing(false);
  };

  const handleToggleTodo = async (todo) => {
    try {
      const updatedTodo = await updateTodo(todo.$id, {
        isCompleted: !todo.isCompleted,
      });
      setTodos(todos.map((t) => (t.$id === todo.$id ? updatedTodo : t)));
    } catch (error) {
      Alert.alert("Error", "Failed to update todo");
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter((t) => t.$id !== todoId));
    } catch (error) {
      Alert.alert("Error", "Failed to delete todo");
    }
  };

  const renderItem = ({ item }) => (
    <View className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-4 my-3 rounded-lg shadow-lg">
      <View className="flex-row justify-between items-center mb-2">
        <Text className={`text-xl font-semibold ${item.isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
          {item.title}
        </Text>
        {item.isCompleted && (
          <Image source={icons.check} className="w-6 h-6" resizeMode="contain" />
        )}
      </View>
      <Text className="text-white text-base mb-4">
        {item.description}
      </Text>
      <View className="flex-row justify-between">
        <CustomButton
          title={item.isCompleted ? "Undo" : "Complete"}
          handlePress={() => handleToggleTodo(item)}
          containerStyles="bg-blue-600 px-3 py-2 rounded-lg shadow-md"
          textStyles="text-white"
        />
        <CustomButton
          title="Delete"
          handlePress={() => handleDeleteTodo(item.$id)}
          containerStyles="bg-red-600 px-3 py-2 rounded-lg shadow-md"
          textStyles="text-white"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={todos}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">Welcome Back,</Text>
              <Text className="text-2xl font-psemibold text-white">{user?.username}</Text>
            </View>
            <View className="mt-1.5">
              <Image source={images.logo} className="w-[150px] -top-8" resizeMode="contain" />
            </View>
          </View>
            <CustomButton
              title="Add Todo"
              handlePress={() => router.push('todo/create-todo')}
              containerStyles="bg-green-500 px-4 py-2 rounded-lg"
              textStyles="text-white text-center"
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Todos Found"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default TodoListPage;
