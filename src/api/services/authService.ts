import axios from '../axios';

export const login = async (reqData: any) => {
	try {
		return await axios.post('/login/', reqData);
	} catch (error) {
		throw error;
	}
};