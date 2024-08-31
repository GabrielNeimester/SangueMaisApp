import { config } from '@gluestack-ui/config';
import { GluestackUIProvider, Heading } from '@gluestack-ui/themed';
import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

export default function Layout() {

  return (
    <GluestackUIProvider config={config}>
      <View style={styles.container}>
      <Heading style={styles.titulo}>Sangue</Heading>
      <View style={styles.logo}>
      <Svg  width="32" height="60" viewBox="0 0 27 40" fill="none">
          <Path d="M13.5 0L25.1913 21.1268H1.80866L13.5 0Z" fill="#FFF4F4" />
          <Ellipse cx="13.5" cy="27.5" rx="13.5" ry="12.5" fill="#FFF4F4" />
          <Path d="M12.64 30.3764V19.2884H15.736V30.3764H12.64ZM8.488 26.2964V23.3684H19.912V26.2964H8.488Z" fill="#F62424" />
        </Svg>
      </View>
      </View>
      <Slot />
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#E31515',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16
  },
  titulo:{
    fontSize: 24,
    color:'#FFF4F4',
    padding: 4
  },
  logo:{
    padding: 4
  }
});