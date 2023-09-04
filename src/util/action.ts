import * as React from 'react';

// toast
export const toastRef = React.createRef<any>();

export const showToast = (text: string) => {
  toastRef.current?.show(text);
};

// loading
export const loadingRef = React.createRef<any>();

export const showLoading = () => {
  loadingRef.current?.show();
};

export const hideLoading = () => {
  loadingRef.current?.hide();
};
