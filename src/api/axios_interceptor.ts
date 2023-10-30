import axios from 'axios';

const instance = axios.create({
	// Todo: 추후 env 파일로 분리
	baseURL: 'http://192.168.35.52:8001/api', // API 엔드포인트 기본 URL 설정
	validateStatus: function (status) {
		return status >= 200 && status < 500; // 200-499 사이의 상태 코드를 유효한 상태로 처리
	},
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
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
instance.interceptors.response.use(
	(response) => {
		// 응답 후에 필요한 로직 추가 (예: 에러 처리)
		return response;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default instance;
