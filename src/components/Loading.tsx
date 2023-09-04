import React, { useImperativeHandle, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface Props {}

const Loading: React.FC<Props> = React.forwardRef((_props, ref) => {
  const [isShow, setShow] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    show: () => show(),
    hide: () => hide(),
  }));

  const show = () => {
    setShow(true);
  };

  const hide = () => {
    setShow(false);
  };

  return (
    <>
      {isShow && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  loadingWrap: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
    height: '100%',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
