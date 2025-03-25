import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import Swiper from 'react-native-deck-swiper';
import { TMDB_API_KEY, TMDB_API_BASE_URL } from '@env';


type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  description?: string;
};

const { width, height } = Dimensions.get('window');
const cardWidth = width * 0.8; // 80% of the screen width
const cardHeight = height * 0.65; // 65% of the screen height

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [swipedAll, setSwipedAll] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const url = `${TMDB_API_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
      const response = await axios.get(url);
      const mappedMovies = response.data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        description: movie.overview,
      }));
      setMovies(mappedMovies);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSwipedAll = () => {
    setSwipedAll(true);
  };

  const onSwipedRight = (index: number) => {
    console.log('Liked:', movies[index]?.title);
  };

  const onSwipedLeft = (index: number) => {
    console.log('Disliked:', movies[index]?.title);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading popular movies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>The Movie Matching</Text>
      <Swiper
        cards={movies}
        renderCard={(film) =>
          film ? (
            <View style={styles.card}>
              <Text style={styles.title}>{film.title}</Text>
              {film.poster_path && (
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${film.poster_path}` }}
                  style={styles.poster}
                />
              )}
              <Text style={styles.description} numberOfLines={3}>
                {film.description}
              </Text>
            </View>
          ) : (
            <View />
          )
        }
        
        onSwipedRight={onSwipedRight}
        onSwipedLeft={onSwipedLeft}
        onSwipedAll={onSwipedAll}
        stackSize={3}
        backgroundColor="transparent"
      />

      {swipedAll && <Text>You have swiped all movies!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2', // a light, neutral background
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  card: {
    width: cardWidth,
    height: cardHeight,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Android shadow
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  poster: {
    width: '100%', // full width of card's content area
    height: cardHeight * 0.70, // 55% of card height for the poster image
    borderRadius: 20,
    resizeMode: 'cover',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    maxHeight: 120,
  },
});