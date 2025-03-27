// app/room.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function RoomScreen() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoom = async () => {
    // Generate a unique room code (6-character alphanumeric)
    const newRoom = Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      // Save the new room to Firestore under "rooms"
      await addDoc(collection(db, "rooms"), {
        roomId: newRoom,
        createdAt: Date.now(),
        users: [], // optionally, you can add user IDs here later
      });
      router.push({ pathname: '/(tabs)', params: { roomId: newRoom } });
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleJoinRoom = () => {
    if (roomCode.trim().length > 0) {
      router.push({ pathname: '/(tabs)', params: { roomId: roomCode.trim().toUpperCase() } });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Room</Text>
      <TextInput
        mode="outlined"
        label="Room Code"
        value={roomCode}
        onChangeText={setRoomCode}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleJoinRoom} style={styles.button}>
        Join Room
      </Button>
      <Button mode="outlined" onPress={handleCreateRoom} style={styles.button}>
        Create New Room
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#161616' },
  input: { marginBottom: 20},
  button: { marginVertical: 10 },
});
