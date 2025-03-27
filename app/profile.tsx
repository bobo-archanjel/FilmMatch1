// app/profile.tsx
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput, Text, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const availableGenres = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Horror',
  'Romance',
  'Science Fiction',
  'Thriller',
];

const CURRENT_USER_ID = "user1"; // For testing; later replace with authenticated UID

export default function ProfileScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    setFavoriteGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleSaveProfile = async () => {
    try {
      // Save profile data in Firestore under a "users" collection.
      await setDoc(doc(db, "users", CURRENT_USER_ID), {
        displayName,
        profilePicUrl,
        favoriteGenres, // stored as an array of strings
        updatedAt: Date.now(),
      });
      // Navigate to Room Management screen.
      router.push('/room');
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <TextInput
        mode="outlined"
        label="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Profile Picture URL"
        value={profilePicUrl}
        onChangeText={setProfilePicUrl}
        style={styles.input}
      />
      <Text style={styles.subtitle}>Select Favorite Genres</Text>
      <ScrollView horizontal contentContainerStyle={styles.chipContainer}>
        {availableGenres.map((genre) => (
          <Chip
            key={genre}
            selected={favoriteGenres.includes(genre)}
            onPress={() => toggleGenre(genre)}
            style={styles.chip}
          >
            {genre}
          </Chip>
        ))}
      </ScrollView>
      <Button mode="contained" onPress={handleSaveProfile} style={styles.button}>
        Save Profile
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, marginVertical: 10 },
  input: { width: '100%', marginVertical: 10 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  chip: { margin: 5 },
  button: { marginTop: 20, width: '100%' },
});
