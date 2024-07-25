import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Alert, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchNoteById, updateNote } from '../../lib/appwrite'; // Import your API functions
import CustomButton from '../../components/CustomButton'; // Import the CustomButton component
import FormField from '../../components/FormField'; // Import the FormField component
import { useLocalSearchParams } from 'expo-router';

const EditNotePage = () => {
  const navigation = useNavigation();
  const { Id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const note = await fetchNoteById(Id);
        setTitle(note.title);
        setContent(note.content);
      } catch (error) {
        Alert.alert("Error", "Failed to load note");
      }
    };

    loadNote();
  }, [Id]);

  const handleUpdateNote = async () => {
    if (!title || !content) {
      Alert.alert("Error", "Please fill out both fields");
      return;
    }

    setIsLoading(true);
    try {
      await updateNote(Id, { title, content });
      Alert.alert("Success", "Note updated successfully");
      navigation.goBack(); // Go back to the Notes list page
    } catch (error) {
      Alert.alert("Error", "Failed to update note");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full justify-center items-center">
      <View className="w-full px-4">
        <Text className="text-white text-3xl font-bold mb-8 text-center">
          Edit Note
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
          title="Update Note"
          handlePress={handleUpdateNote}
          containerStyles="bg-green-500 px-4 py-2 rounded-lg mt-6"
          textStyles="text-white text-center"
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditNotePage;
