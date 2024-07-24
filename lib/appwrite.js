import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.daddycoders.notes_todo_list",
  projectId: "669a6f24001da0ced0de",
  storageId: "669a6fb40020c77a4dba",
  databaseId: "669a6f44002b323391bf",
  userCollectionId: "669a6f540012701b64da",
  notesCollectionId: "66a13df1002093c969ae",
  todosCollectionId: "66a13de90015bcaee1dd",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

// Notes CRUD operations
export const createNote = async (title, content) => {
  try {
    const note = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notesCollectionId,
      ID.unique(),
      {
        title,
        content,
        createdAt: new Date().toISOString(),
      }
    );

    return note;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const fetchNotes = async () => {
  try {
    const notes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.notesCollectionId
    );

    return notes.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const updateNote = async (noteId, updatedContent) => {
  try {
    const updatedNote = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notesCollectionId,
      noteId,
      updatedContent
    );

    return updatedNote;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const deleteNote = async (noteId) => {
  try {
    const deletedNote = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notesCollectionId,
      noteId
    );

    return deletedNote;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// Todos CRUD operations
export const createTodo = async (title, description) => {
  try {
    const todo = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.todosCollectionId,
      ID.unique(),
      {
        title,
        description,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      }
    );

    return todo;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const fetchTodos = async () => {
  try {
    const todos = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.todosCollectionId
    );

    return todos.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const updateTodo = async (todoId, updatedContent) => {
  try {
    const updatedTodo = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.todosCollectionId,
      todoId,
      updatedContent
    );

    return updatedTodo;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const deleteTodo = async (todoId) => {
  try {
    const deletedTodo = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.todosCollectionId,
      todoId
    );

    return deletedTodo;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
