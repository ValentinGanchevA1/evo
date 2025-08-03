// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from '@/store/store';
import { AppInitializer } from '@/components/AppInitializer';
import ErrorBoundary from '@/components/ErrorBoundary';
import RootNavigator from '@/navigation/RootNavigator';
import { PersistLoading } from '@/components/PersistLoading';

const App: React.FC = () => {
	return (
		<ErrorBoundary>
			<Provider store={store}>
				<PersistGate loading={<PersistLoading />} persistor={persistor}>
					<AppInitializer>
						<NavigationContainer>
							<RootNavigator />
						</NavigationContainer>
					</AppInitializer>
				</PersistGate>
			</Provider>
		</ErrorBoundary>
	);
};

export default App;
