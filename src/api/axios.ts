import axios from 'axios';

const customApi = axios.create({
	// Todo: 추후 env 파일로 분리
	baseURL: 'http://52.195.234.194/api', // API 엔드포인트 기본 URL 설정
});

export default customApi;
