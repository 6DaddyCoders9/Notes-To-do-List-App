import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation , router } from "expo-router";
import { fetchNotes, createNote, deleteOldNotes } from "../../lib/appwrite";
import EmptyState from "../../components/EmptyState";
import NoteItem from "../../components/NoteItem";
import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants"; // Make sure to include images if used

const NotesPage = () => {
  const { user } = useGlobalContext(); // Access user info from context
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadNotes = async () => {
    try {
      const fetchedNotes = await fetchNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      Alert.alert("Error", "Failed to load notes");
    }
  };

  useEffect(() => {
    loadNotes();

    // Set up interval for deleting old notes
    const intervalId = setInterval(async () => {
      await deleteOldNotes(); // Function to delete old notes
      await loadNotes(); // Optionally refresh the notes list
    }, 24 * 60 * 60 * 1000); // 24 hours

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View className="p-3 bg-blue-600">
      <Image source={images.logo} className="w-40 h-20" resizeMode="contain" />
      <TouchableOpacity
        className="bg-green-500 px-4 py-2 rounded-lg mt-4"
        onPress={() => router.push('note/create-note')}
      >
        <Text className="text-white text-center">Add Note</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={notes}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <NoteItem
            item={item}
            onPress={() => router.push(`/note/${item.$id}`)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<EmptyState title="No Notes Found" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default NotesPage;
