import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Alert, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchTodoById, updateTodo } from '../../lib/appwrite'; // Import your API functions
import CustomButton from '../../components/CustomButton'; // Import the CustomButton component
import FormField from '../../components/FormField'; // Import the FormField component
import { useLocalSearchParams } from 'expo-router';

const EditTodoPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { todoId } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTodo = async () => {
      try {
        const todo = await fetchTodoById(todoId);
        setTitle(todo.title);
        setDescription(todo.description);
      } catch (error) {
        Alert.alert("Error", "Failed to load todo");
      }
    };

    loadTodo();
  }, [todoId]);

  const handleUpdateTodo = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill out both fields");
      return;
    }

    setIsLoading(true);
    try {
      await updateTodo(todoId, { title, description });
      Alert.alert("Success", "Todo updated successfully");
      navigation.goBack(); // Go back to the Todo list page
    } catch (error) {
      Alert.alert("Error", "Failed to update todo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full justify-center items-center">
      <View className="w-full px-4">
        <Text className="text-white text-3xl font-bold mb-8 text-center">
          Edit Todo
        </Text>
        <FormField
          title="Title"
          value={title}
          placeholder="Enter todo title"
          handleChangeText={setTitle}
        />
        <FormField
          title="Description"
          value={description}
          placeholder="Enter todo description"
          handleChangeText={setDescription}
          otherStyles="mt-4"
          multiline
        />
        <CustomButton
          title="Update Todo"
          handlePress={handleUpdateTodo}
          containerStyles="bg-green-500 px-4 py-2 rounded-lg mt-6"
          textStyles="text-white text-center"
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditTodoPage;
