import {
	Platform,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch} from '../../../redux/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {hideLoading, showLoading} from "../../../util/action";
import AsyncStorage from "@react-native-async-storage/async-storage";
import commonSlice from "../../../redux/slices/common";
import {routes} from "../../../routes";
import {commonStyles, theme} from "../../../assets/styles/common-styles";
import {AppImages} from "../../../assets";
import {WithLocalSvg} from "react-native-svg";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store/reducers";
import {ResponseCompanyModel} from "../../../api/models/responses/company/response-company.model";

const HomeView = () => {
	const dispatch = useAppDispatch();
	const navigation = useNavigation<any>();

	// redux에 저장 된 회사 정보 가져오기
	const selectedCompany = useSelector((state: RootState) => state.common.selectedCompany);

	const [refreshing, setRefreshing] = useState<boolean>(false);

	const onRefresh = useCallback((): void => {
		setRefreshing(true);
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}, []);

	useEffect(() => {
		console.log('HomeView mounted');
		showLoading();
		setTimeout(() => {
			hideLoading();
		}, 500);
	}, []);

	return (
		<SafeAreaView style={{flex: 1}}>
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
				}
			>
				<View style={commonStyles.pageLayout}>
					<View style={styles.companyCard}>
						<Text style={styles.companyCardText}>{selectedCompany.name}</Text>
						<TouchableOpacity
							onPress={() => {}}
						>
							<WithLocalSvg asset={AppImages.iconMarker} width="20" height="20" />
						</TouchableOpacity>
					</View>
					<View style={[styles.shadowWrap, styles.mainCardWrap]}>
						<View style={[styles.menuButtonContainer, {paddingBottom: 10}]}>
							<WithLocalSvg asset={AppImages.iconConins} width="20" height="20" />
							<Text style={styles.menuButtonText}>보유 포인트 <Text style={{color: '#fff'}}>0P</Text></Text>
						</View>
						<View style={styles.createReviewButtonContainer}>
							<TouchableOpacity
								onPress={() => navigation.navigate(routes.POINT_CHARGING)}
								style={[
									styles.createReviewButton,
									{backgroundColor: '#fff'},
								]}
							>
								<WithLocalSvg asset={AppImages.iconAdd} width="20" height="20" />
								<Text style={styles.createReviewButtonText}>포인트 충전</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => navigation.navigate(routes.CREATE_REVIEW_BLOG)}
								style={[
									styles.createReviewButton,
									{backgroundColor: '#eeeeee'},
								]}
							>
								<WithLocalSvg asset={AppImages.iconShoppingBagAdd} width="17" height="17" />
								<Text style={styles.createReviewButtonText}>식권 구매</Text>
							</TouchableOpacity>
						</View>
					</View>
					<TouchableOpacity
						onPress={() => {}}
					>
						<View>
							<Icon name='star' size={25} color="black"/>
							<Text style={styles.menuButtonText}>충전 내역</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={{}} onPress={() => {
						// storage 초기화
						AsyncStorage.clear();
						dispatch(commonSlice.actions.setUserUuid({userUuid: ''}));
						dispatch(commonSlice.actions.setCompanyUuid({selectedCompany: new ResponseCompanyModel()}));
					}}>
						<View style={styles.shadowWrap}>
							<View style={styles.menuButtonContainer}>
								<Text
									style={{
										color: '#333',
										fontSize: 15,
										fontWeight: '700',
									}}
								>
									[임시] 로그아웃
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	shadowWrap: {
		backgroundColor: '#fff',
		shadowColor: 'rgba(0, 0, 0, 0.3)',
		padding: 10,
		borderRadius: 10,
		...Platform.select({
			ios: {
				shadowColor: 'rgba(0, 0, 0, 0.3)',
				shadowOffset: {width: 0, height: 2},
				shadowOpacity: 0.3,
				shadowRadius: 4,
			},
			android: {
				elevation: 5,
			},
		}),
		flexDirection: 'column',
		gap: 10,
		marginBottom: 15,
	},
	menuButtonContainer: {
		paddingHorizontal: 10,
		paddingVertical: 15,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	menuButtonText: {
		color: '#fff',
		fontSize: 15,
		fontWeight: '600',
	},
	createReviewButtonContainer: {
		paddingHorizontal: 10,
		paddingBottom: 15,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	createReviewButton: {
		padding: 10,
		borderRadius: 10,
		flex: 1,
		height: 50,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 7,
		borderColor: '#fff',
		borderWidth: 0.5,
	},
	createReviewButtonText: {
		textAlign: 'center',
		fontSize: 15,
		fontWeight: '600',
		color: theme.primaryColor
	},
	mainCardWrap: {
		backgroundColor: theme.primaryColor
	},
	companyCard: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
		paddingVertical: 15,
	},
	companyCardText: {
		fontSize: 17,
		fontWeight: '600',
	}
});

export default HomeView;
