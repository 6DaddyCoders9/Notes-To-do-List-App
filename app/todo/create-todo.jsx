import React, { useState } from 'react';
import { SafeAreaView, View, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createTodo } from '../../lib/appwrite'; // Import your API function
import CustomButton from '../../components/CustomButton'; // Import the CustomButton component
import FormField from '../../components/FormField'; // Import the FormField component

const CreateTodoPage = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTodo = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill out both fields");
      return;
    }

    setIsLoading(true);
    try {
      await createTodo(title, description);
      Alert.alert("Success", "Todo created successfully");
      navigation.goBack(); // Go back to the Todo list page
    } catch (error) {
      Alert.alert("Error", "Failed to create todo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full justify-center items-center">
      <View className="w-full px-4">
        <Text className="text-white text-3xl font-bold mb-8 text-center">
          Create New Todo
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
          title="Create Todo"
          handlePress={handleCreateTodo}
          containerStyles="bg-green-500 px-4 py-2 rounded-lg mt-6"
          textStyles="text-white text-center"
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateTodoPage;
