// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import axios from 'axios';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { TMDB_API_KEY, TMDB_API_BASE_URL } from '@env';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Snackbar } from 'react-native-paper';
import { onAuthStateChanged } from 'firebase/auth';


type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  description?: string;
  genres: number[];
};

export default function FilmMatchScreen() {

  
  <SafeAreaView style={styles.safeArea}>
  {/* rest of your code */}
</SafeAreaView>


  // Retrieve route parameters (if any)
  const { roomId, favoriteGenres } = useLocalSearchParams<{
    roomId?: string;
    favoriteGenres?: string; // comma-separated if multiple
  }>();
  const router = useRouter();
  const ROOM_ID = roomId || 'defaultRoom';

  // State for movies and loading
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // State for Snackbar
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // State for authenticated user ID
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
        router.push('/auth');
      }
    });
    return unsubscribe;
  }, [router]);

  useEffect(() => {
    if (currentUserId) {
      fetchMovies();
    }
  }, [favoriteGenres, currentUserId]);

  // Genre name -> TMDB ID mapping
  const genreMap: { [key: string]: number } = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Music: 10402,
    Mystery: 9648,
    Romance: 10749,
    'Science Fiction': 878,
    Thriller: 53,
    War: 10752,
    Western: 37,
  };

  const fetchMovies = async () => {
    try {
      const url = `${TMDB_API_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
      const response = await axios.get(url);
      let mappedMovies: Movie[] = response.data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        description: movie.overview,
        genres: movie.genre_ids,
      }));

      // Filter by favorite genres if provided
      if (favoriteGenres) {
        const selectedGenres = favoriteGenres.split(',').map(g => g.trim().toLowerCase());
        mappedMovies = mappedMovies.filter(movie =>
          selectedGenres.some(genreName => {
            const matchingKey = Object.keys(genreMap).find(key => key.toLowerCase() === genreName);
            const genreId = matchingKey ? genreMap[matchingKey] : undefined;
            return genreId && movie.genres.includes(genreId);
          })
        );
      }
      setMovies(mappedMovies);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSwipe = async (index: number, liked: boolean) => {
    const movie = movies[index];
    if (!movie || !currentUserId) return;
    try {
      // Write swipe to Firestore
      const swipeDocRef = await addDoc(collection(db, "rooms", ROOM_ID, "swipes"), {
        filmId: movie.id,
        filmTitle: movie.title,
        liked,
        userId: currentUserId,
        timestamp: Date.now(),
      });
      console.log("Swipe written with ID:", swipeDocRef.id);

      if (liked) {
        showSnackbar(`You liked ${movie.title}`);
      } else {
        showSnackbar(`You disliked ${movie.title}`);
      }

      if (liked) {
        // Simple partner ID logic for demonstration
        const partnerId = currentUserId === "user1" ? "user2" : "user1";
        const swipesQuery = query(
          collection(db, "rooms", ROOM_ID, "swipes"),
          where("filmId", "==", movie.id),
          where("userId", "==", partnerId),
          where("liked", "==", true)
        );
        const querySnapshot = await getDocs(swipesQuery);
        if (!querySnapshot.empty) {
          showSnackbar(`It's a match! ${movie.title}`);
          Alert.alert("It's a match!", `You both liked ${movie.title}`);
          const matchDocRef = await addDoc(collection(db, "rooms", ROOM_ID, "matches"), {
            filmId: movie.id,
            filmTitle: movie.title,
            filmDescription: movie.description || "",
            users: [currentUserId, partnerId],
            timestamp: Date.now(),
          });
          console.log("Match written with ID:", matchDocRef.id);
        }
      }
    } catch (error) {
      console.error("Error in handleSwipe:", error);
      Alert.alert("Error", "There was an error recording your swipe. Please try again.");
    }
  };

  if (!currentUserId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3366" />
        <Text style={styles.loadingText}>Please sign in...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3366" />
        <Text style={styles.loadingText}>Loading movies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Minimalistic Header with Room Code */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Room Code: {ROOM_ID}</Text>
        {/* You could also add a button or icon on the right, e.g. for profile or logout */}
      </View>

      <View style={styles.swiperContainer}>
        <Swiper
          cards={movies}
          renderCard={(movie: Movie): JSX.Element =>
            movie ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{movie.title}</Text>
                {movie.poster_path && (
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                    style={styles.poster}
                  />
                )}
                <Text style={styles.cardDescription} numberOfLines={3}>
                  {movie.description}
                </Text>
              </View>
            ) : (
              <View />
            )
          }
          onTapCard={(index: number) => {
            const movie = movies[index];
            if (movie) {
              router.push({
                pathname: '/movieDetail',
                params: {
                  id: movie.id.toString(),
                  title: movie.title,
                  poster_path: movie.poster_path,
                  description: movie.description,
                },
              });
            }
          }}
          onSwipedRight={(index: number) => handleSwipe(index, true)}
          onSwipedLeft={(index: number) => handleSwipe(index, false)}
          stackSize={3}
          backgroundColor="#191919"
        />
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#191919', // match your dark background
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#191919',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#191919', // Dark background
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50, // or use safe area
    paddingBottom: 16,
    backgroundColor: '#191919', // same as background
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  swiperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 320,
    height: 460,
    backgroundColor: '#2C2C2C',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  poster: {
    width: '100%',
    height: 260,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#BBBBBB',
    textAlign: 'center',
  },
  snackbar: {
    backgroundColor: '#333333',
  },
});
