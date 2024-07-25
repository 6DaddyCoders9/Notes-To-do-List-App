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
import { fetchTodos, updateTodo, createTodo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import TodoItem from "../../components/TodoItem";

const TodoListPage = () => {
  const { user } = useGlobalContext();
  const [todos, setTodos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch todos
  const loadTodos = async () => {
    try {
      const fetchedTodos = await fetchTodos();
      setTodos(fetchedTodos);
    } catch (error) {
      Alert.alert("Error", "Failed to load todos");
    }
  };

  // Polling mechanism to refresh todos periodically
  useEffect(() => {
    loadTodos(); // Initial load
    const intervalId = setInterval(() => {
      loadTodos();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Refresh handler for pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadTodos();
    setRefreshing(false);
  };

  // Handler to toggle todo completion status
  const handleToggleTodo = async (todo) => {
    try {
      const updatedTodo = await updateTodo(todo.$id, {
        isCompleted: !todo.isCompleted,
      });
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.$id === todo.$id ? updatedTodo : t))
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update todo");
    }
  };

  // Render header component
  const renderHeader = () => (
    <View className="p-3 bg-blue-600">
      <View className="flex-row">
        <Image source={images.logo} className="w-40 h-20" resizeMode="contain" />
        <View className="pt-4 pl-12">
          <Text className="font-pmedium text-sm text-gray-100">Welcome Back,</Text>
          <Text className="text-xl font-psemibold text-white">{user?.username}</Text>
        </View>
      </View>
      <TouchableOpacity
        className="bg-green-500 px-4 py-2 rounded-lg mt-4"
        onPress={() => router.push('todo/create-todo')}
      >
        <Text className="text-white text-center">Add Todo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={todos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onToggle={() => handleToggleTodo(item)}
            onPress={() => router.push(`/todo/${item.$id}`)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<EmptyState title="No Todos Found" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default TodoListPage;
