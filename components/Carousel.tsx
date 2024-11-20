import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window'); // Full screen width and height

interface CarouselProps {
  data: { url: string }[];
  autoplayInterval?: number; // Time between slides (ms)
}

const Carousel: React.FC<CarouselProps> = ({ data, autoplayInterval = 3000 }) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const autoplay = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, autoplayInterval);

    return () => clearInterval(autoplay); // Clean up interval on unmount
  }, [data.length, autoplayInterval]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [currentIndex]);

  const handleManualSwipe = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      {/* Image Carousel */}
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={handleManualSwipe}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.url }}
              style={styles.image}
              resizeMode="cover" // Use "cover" for better fitting
            />
          </View>
        )}
      />

      {/* Dots Navigation */}
      <View style={styles.dotContainer}>
        {data.map((_, index) => {
          const dotScale = scrollX.interpolate({
            inputRange: [
              width * (index - 1),
              width * index,
              width * (index + 1),
            ],
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index.toString()}
              style={[styles.dot, { transform: [{ scale: dotScale }] }]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  imageContainer: {
    width: width,
    height: height * 0.3, // 30% of the screen height
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10, // Adjust the position of the dots from the bottom
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFA500',
    marginHorizontal: 4,
  },
});

export default Carousel;
