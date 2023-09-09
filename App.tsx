import React from 'react';
import AppControlFlow from './src/AppControlFlow';
import {Provider} from 'react-redux';
import store from './src/redux/store';

const App = () => {
	return (
		<Provider store={store}>
			<AppControlFlow/>
		</Provider>
	);
};

export default App;
