import React, { useState } from "react";
import { SafeAreaView, View, Text, Alert } from "react-native";
import { useNavigation } from "expo-router";
import { createNote } from "../../lib/appwrite"; // Ensure this function is correctly implemented
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

const CreateNotePage = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNote = async () => {
    if (!title || !content) {
      Alert.alert("Error", "Please fill out both fields");
      return;
    }
  
    setIsLoading(true);
    try {
      await createNote({
        title,
        content, // Ensure content is provided here
        createdAt: new Date().toISOString(),
      });
      Alert.alert("Success", "Note created successfully");
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      Alert.alert("Error", "Failed to create note");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <SafeAreaView className="bg-primary h-full justify-center items-center">
      <View className="w-full px-4">
        <Text className="text-white text-3xl font-bold mb-8 text-center">
          Create New Note
        </Text>
        <FormField
          title="Title"
          value={title}
          placeholder="Enter note title"
          handleChangeText={setTitle}
        />
        <FormField
          title="Content"
          value={content}
          placeholder="Enter note content"
          handleChangeText={setContent}
          otherStyles="mt-4"
          multiline
        />
        <CustomButton
          title="Create Note"
          handlePress={handleCreateNote}
          containerStyles="bg-green-500 px-4 py-2 rounded-lg mt-6"
          textStyles="text-white text-center"
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateNotePage;
