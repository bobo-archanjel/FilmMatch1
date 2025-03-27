// app/(tabs)/matches.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const ROOM_ID = "room123";

export default function MatchesScreen() {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "rooms", ROOM_ID, "matches"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMatches(data);
      },
      (error) => {
        console.error("Error fetching matches: ", error);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Matches</Text>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.matchItem}>
            <Text style={styles.matchTitle}>{item.filmTitle}</Text>
            <Text style={styles.matchDesc} numberOfLines={2}>
              {item.filmDescription}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>No matches yet. Keep swiping!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 15 },
  matchItem: { padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 10 },
  matchTitle: { fontSize: 20, fontWeight: '600', marginBottom: 5 },
  matchDesc: { fontSize: 16, color: '#555' },
});
