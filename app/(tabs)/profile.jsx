import { useEffect, useState } from "react";
import { SafeAreaView, View, Image, FlatList, TouchableOpacity, Text, RefreshControl, Alert } from "react-native";
import { router } from "expo-router";
import { icons } from "../../constants";
import { fetchTodos, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import EmptyState from "../../components/EmptyState";
import InfoBox from "../../components/InfoBox.jsx";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [incompleteTodos, setIncompleteTodos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Function to load incomplete todos
  const loadIncompleteTodos = async () => {
    try {
      const todos = await fetchTodos();
      const incomplete = todos.filter(todo => !todo.isCompleted);
      setIncompleteTodos(incomplete);
    } catch (error) {
      console.log("Failed to fetch todos", error);
    }
  };

  // Use effect to load incomplete todos on component mount
  useEffect(() => {
    loadIncompleteTodos();
  }, []);

  // Function to handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadIncompleteTodos();
    setRefreshing(false);
  };

  // Function to handle logout
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4 pt-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />
            <View className="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg">
              <Text className="text-white text-lg font-semibold">
                Remaining Todos: {incompleteTodos.length}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState title="No Incomplete Todos" />}
        data={incompleteTodos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View className="p-4 bg-gray-700 mb-2 rounded-lg shadow-lg">
            <Text className="text-white text-lg font-semibold">{item.title}</Text>
            <Text className="text-white text-base mt-2">{item.description}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
