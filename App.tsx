import React from 'react';
import AppControlFlow from './src/AppControlFlow';
import {RecoilRoot} from 'recoil';

const App = () => {
	return (
		<RecoilRoot>
			<AppControlFlow/>
		</RecoilRoot>
	);
};

export default App;
