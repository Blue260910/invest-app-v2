import React, { ReactNode } from 'react';
import { ScrollView, View, StyleSheet, ViewStyle } from 'react-native';

type MarqueeProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export const Marquee = ({ children, style }: MarqueeProps) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={style}
  >
    <View style={styles.row}>{children}</View>
  </ScrollView>
);

type MarqueeContentProps = {
  children: ReactNode;
};
export const MarqueeContent = ({ children }: MarqueeContentProps) => <>{children}</>;
export const MarqueeFade = () => null;

type MarqueeItemProps = {
  children: ReactNode;
  style?: ViewStyle;
};
export const MarqueeItem = ({ children, style }: MarqueeItemProps) => (
  <View style={[styles.item, style]}>{children}</View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    marginHorizontal: 16,
    flexShrink: 0,
  },
});