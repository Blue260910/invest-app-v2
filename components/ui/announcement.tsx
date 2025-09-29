
import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextProps } from 'react-native';

export type AnnouncementProps = ViewProps & {
  themed?: boolean;
  children?: React.ReactNode;
};
export const Announcement = ({ themed = false, style, children, ...props }: AnnouncementProps) => (
  <View
    style={[
      styles.announcement,
      themed && styles.announcementThemed,
      style
    ]}
    {...props}
  >
    {children}
  </View>
);

export type AnnouncementTagProps = TextProps & {
  children?: React.ReactNode;
};
export const AnnouncementTag = ({ style, children, ...props }: AnnouncementTagProps) => (
  <Text style={[styles.tag, style]} {...props}>{children}</Text>
);

export type AnnouncementTitleProps = TextProps & {
  children?: React.ReactNode;
};
export const AnnouncementTitle = ({ style, children, ...props }: AnnouncementTitleProps) => (
  <Text style={[styles.title, style]} {...props}>{children}</Text>
);

const styles = StyleSheet.create({
  announcement: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  announcementThemed: {
    borderColor: '#222',
    borderWidth: 1,
  },
  tag: {
    marginLeft: -10,
    flexShrink: 0,
    borderRadius: 999,
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    fontSize: 16,
    fontWeight: '500',
  },
});