import axios from './axios';

// 요청 인터셉터 설정
axios.interceptors.request.use(
	(config) => {
		config.headers['Content-Type'] = 'application/json';
		// 요청 전에 필요한 로직 추가 (예: 토큰 인증)
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// 응답 인터셉터 설정
axios.interceptors.response.use(
	(response) => {
		// 응답 후에 필요한 로직 추가 (예: 에러 처리)
		return response;
	},
	(error) => {
		return Promise.reject(error);
	}
);
