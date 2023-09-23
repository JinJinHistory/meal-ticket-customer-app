import customApi from '../axios';

export const login = async (reqData: any) => {
	try {
		return await customApi.post('/login/', reqData);
	} catch (error) {
		throw error;
	}
};