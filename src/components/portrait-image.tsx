import { Image as ExpoImage } from 'expo-image';

export function PortraitImage() {
  return (
    <ExpoImage
      source={require('../../assets/images/icon.png')}
      accessibilityLabel="Portrait of Joseph Tabalon"
      contentFit="cover"
      className="h-[148px] w-[148px] md:h-[330px] md:w-[280px]"
    />
  );
}
