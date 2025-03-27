// app/movieDetail.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { TMDB_API_KEY, TMDB_API_BASE_URL } from '@env';
import { useLocalSearchParams } from 'expo-router';

export default function MovieDetailScreen() {
  const { id, title, poster_path, description } = useLocalSearchParams();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Example: fetch movie details including runtime and cast
        const detailUrl = `${TMDB_API_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`;
        const response = await axios.get(detailUrl);
        setDetails(response.data);
      } catch (err) {
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {poster_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${poster_path}` }}
          style={styles.poster}
        />
      )}
      <Text style={styles.description}>{description}</Text>
      {details && (
        <View style={styles.extraInfo}>
          <Text style={styles.infoText}>Runtime: {details.runtime} minutes</Text>
          <Text style={styles.infoText}>Rating: {details.vote_average}</Text>
          {/* You can add more info such as cast, trailer, etc. */}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  poster: { width: '100%', height: 300, resizeMode: 'cover', borderRadius: 10, marginBottom: 15 },
  description: { fontSize: 16, color: '#555', textAlign: 'left' },
  extraInfo: { marginTop: 20 },
  infoText: { fontSize: 16, marginVertical: 5 },
});
