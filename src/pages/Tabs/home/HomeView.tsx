import {Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import NoticeListView from './notice/NoticeListView';
import {useAppDispatch} from '../../../redux/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {hideLoading, showLoading} from "../../../util/action";
import AsyncStorage from "@react-native-async-storage/async-storage";
import commonSlice from "../../../redux/slices/common";
import {routes} from "../../../routes";

const buttonList: { name: string; path: string; iconName: string }[] = [
	{name: '진행중인 리뷰', path: routes.ONGOING_LIST, iconName: 'list'},
	{name: '완료된 리뷰', path: routes.COMPLETED_LIST, iconName: 'list'},
	{name: '인스타 좋아요 신청', path: '', iconName: 'star'},
];

const HomeView = () => {
	const dispatch = useAppDispatch();
	const navigation = useNavigation<any>();

	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = React.useCallback(() => {
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
		<ScrollView
			// contentContainerStyle={styles.scrollView}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
			}
		>
			<View style={styles.wrap}>
				<View style={styles.shadowWrap}>
					<View style={[styles.menuButtonContainer, {paddingBottom: 10}]}>
						<Icon name="edit" size={25} color="black"/>
						<Text style={styles.menuButtonText}>새로운 리뷰 작성</Text>
					</View>
					<View style={styles.createReviewButtonContainer}>
						<TouchableOpacity
							onPress={() => navigation.navigate(routes.CREATE_REVIEW_BLOG)}
							style={[
								styles.createReviewButton,
								{backgroundColor: '#eeeeee'},
							]}
						>
							<Text style={styles.createReviewButtonText}>블로그</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.createReviewButton, {backgroundColor: 'orange'}]}
							onPress={() => navigation.navigate(routes.CREATE_REVIEW_DIRECT)}
						>
							<Text style={styles.createReviewButtonText}>방문자</Text>
						</TouchableOpacity>
					</View>
				</View>
				{buttonList.map((button, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => navigation.navigate(button.path)}
					>
						<View style={styles.shadowWrap}>
							<View style={styles.menuButtonContainer}>
								<Icon name={button.iconName} size={25} color="black"/>
								<Text style={styles.menuButtonText}>{button.name}</Text>
							</View>
						</View>
					</TouchableOpacity>
				))}
				<View style={styles.shadowWrap}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							borderBottomColor: '#e5e5e5',
							borderBottomWidth: 0.5,
							padding: 15,
						}}
					>
						<Text style={{fontSize: 15, fontWeight: '600'}}>공지사항</Text>
						<TouchableOpacity style={{}} onPress={() => {
							navigation.navigate(routes.NOTICE_LIST)
						}}>
							<Text
								style={{
									color: 'orange',
									fontSize: 12,
								}}
							>
								more
							</Text>
						</TouchableOpacity>
					</View>
					<NoticeListView/>
				</View>
				<TouchableOpacity style={{}} onPress={() => {
					// storage 초기화
					AsyncStorage.clear();
					dispatch(commonSlice.actions.setToken({token: null}));
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
	);
};

const styles = StyleSheet.create({
	wrap: {
		padding: 15,
	},
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
		color: '#000',
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
		justifyContent: 'center',
		borderColor: '#ddd',
		borderWidth: 0.5,
	},
	createReviewButtonText: {
		textAlign: 'center',
		fontSize: 15,
		fontWeight: '600',
	},
});

export default HomeView;
