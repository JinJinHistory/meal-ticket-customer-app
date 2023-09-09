import {
	ActivityIndicator,
	Image,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
// import { useNavigation } from '@react-navigation/native';
import {
	ONGOING_REVIEW_LIST,
	ONGOING_REVIEW_LIST_SEARCH_TYPE_LIST,
} from '../model/reviewList';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OngoingItem from './OngoingItem';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {AppImages} from '../../../assets';
import {hideLoading, showLoading} from '../../../util/action';
import DatePicker from "react-native-date-picker";

const OngoingListView = () => {
	// search type title
	const [searchTypeTitle1, setSearchTypeTitle1] =
		React.useState<string>('1개월');
	const [searchTypeTitle2, setSearchTypeTitle2] =
		React.useState<string>('전체');
	const [searchTypeTitle3, setSearchTypeTitle3] =
		React.useState<string>('최신순');

	const [selectedSearchType, setSelectedSearchType] = React.useState([0, 0, 0]);

	// 검색조건 선택 시 기존 선택 값 저장하기 위한 변수 useRef
	const selectedSearchTypeRef = useRef<number[]>([]);

	// 검색 조건 선택 submit 이벤트
	const onClickSearchTypeSubmit = () => {
		showLoading();
		setTimeout(() => {
			hideLoading();
			selectedSearchTypeRef.current = [...selectedSearchType];
			setSearchTypeTitle1(
				ONGOING_REVIEW_LIST_SEARCH_TYPE_LIST[0].searchItems[
					selectedSearchType[0]
					].name,
			);
			setSearchTypeTitle2(
				ONGOING_REVIEW_LIST_SEARCH_TYPE_LIST[1].searchItems[
					selectedSearchType[1]
					].name,
			);
			setSearchTypeTitle3(
				ONGOING_REVIEW_LIST_SEARCH_TYPE_LIST[2].searchItems[
					selectedSearchType[2]
					].name,
			);
			bottomSheetModalRef.current?.dismiss();
		}, 500);
	};

	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}, []);

	useEffect(() => {
		console.log('OngoingListView mounted');
		showLoading();
		setTimeout(() => {
			hideLoading();
		}, 500);
	}, []);

	// ref
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	// variables
	const snapPoints = useMemo(() => ['70%'], []);

	// callbacks
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);
	const handleSheetChanges = useCallback(
		(index: number) => {
			// bottomsheet 오픈
			if (index === 0) {
				selectedSearchTypeRef.current = [...selectedSearchType];
				// bottomsheet 닫힘
			} else {
				console.log(selectedSearchTypeRef.current);
				console.log(selectedSearchType);
				[...selectedSearchTypeRef.current].sort().join(',') !==
				[...selectedSearchType].sort().join(',') &&
				setSelectedSearchType(selectedSearchTypeRef.current);
			}
		},
		[selectedSearchType, selectedSearchTypeRef.current],
	);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				pressBehavior="close"
				appearsOnIndex={0}
				disappearsOnIndex={-1}
			/>
		),
		[],
	);

	const isCloseToBottom = ({
		                         layoutMeasurement,
		                         contentOffset,
		                         contentSize,
	                         }: any): boolean => {
		const paddingToBottom: number = 20;
		return (
			layoutMeasurement.height + contentOffset.y >=
			contentSize.height - paddingToBottom
		);
	};

	// infinite loading 여부
	const [isInfiniteLoading, setIsInfiniteLoading] =
		React.useState<boolean>(false);

	return (
		<>
			<View style={styles.controlContainer}>
				<TouchableOpacity style={{}} onPress={() => {
				}}>
					<Icon name="search" size={25} color="white"/>
				</TouchableOpacity>
				<TouchableOpacity style={{}} onPress={handlePresentModalPress}>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							gap: 5,
						}}
					>
						<Text style={{color: 'white', fontSize: 12}}>
							{searchTypeTitle1} • {searchTypeTitle2} • {searchTypeTitle3}
						</Text>
						<Image source={AppImages.downArrow} resizeMode="cover"/>
					</View>
				</TouchableOpacity>
			</View>
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
				}
				onScroll={({nativeEvent}) => {
					if (isCloseToBottom(nativeEvent) && !isInfiniteLoading) {
						setIsInfiniteLoading(true);
						setTimeout(() => {
							setIsInfiniteLoading(false);
						}, 2000);
						console.log('close to bottom');
					}
				}}
				scrollEventThrottle={100}
			>
				{ONGOING_REVIEW_LIST.length === 0 && (
					<Text style={styles.noItemText}>진행중인 리뷰가 없습니다.</Text>
				)}
				{ONGOING_REVIEW_LIST.map(item => (
					<OngoingItem {...item} />
				))}
				{isInfiniteLoading && (
					<View style={{paddingVertical: 20}}>
						<ActivityIndicator size="small" color="#333"/>
					</View>
				)}
			</ScrollView>
			<BottomSheetModalProvider>
				<BottomSheetModal
					ref={bottomSheetModalRef}
					index={0}
					snapPoints={snapPoints}
					onChange={handleSheetChanges}
					backdropComponent={renderBackdrop}
				>
					<View style={styles.bottomSheetContainer}>
						{/*상위 아이템 map*/}
						{ONGOING_REVIEW_LIST_SEARCH_TYPE_LIST.map(item => (
							<View key={item.searchType.key} style={styles.searchContainer}>
								<Text style={styles.searchTitle}>{item.searchType.name}</Text>
								<View style={styles.searchItemContainer}>
									{/*하위 아이템 map*/}
									{item.searchItems.map(searchItem => (
										<TouchableOpacity
											key={searchItem.key}
											style={[
												styles.searchItemButton,
												selectedSearchType[item.searchType.key] ===
												searchItem.key && styles.activeSearchItemButton,
											]}
											onPress={() => {
												// item.searchType.key 위치의 값을 searchItem.key로 변경
												setSelectedSearchType(prevState => {
													const newState = [...prevState];
													newState[item.searchType.key] = searchItem.key;
													if (searchItem.name === '직접설정') {
														console.log('직접설정이므로 range picker 노출 필요');
													}
													return newState;
												});
											}}
										>
											<Text
												style={[
													styles.searchItemText,
													selectedSearchType[item.searchType.key] ===
													searchItem.key && styles.activeSearchItemText,
												]}
											>
												{searchItem.name}
											</Text>
										</TouchableOpacity>
									))}
								</View>
								{/*/!*직접설정일 경우 date range picker 영역*!/*/}
								{/*{*/}
								{/*	item.searchType.key === 0 && selectedSearchType[0] === 2 && (*/}
								{/*		// <View style={styles.rangePickerRow}>*/}
								{/*		// 	<DatePicker style={styles.rangePicker} mode="date" date={new Date()}/>*/}
								{/*		// 	<Text>~</Text>*/}
								{/*		// 	<DatePicker style={styles.rangePicker} mode="date" date={new Date()}/>*/}
								{/*		// </View>*/}
								{/*	// )*/}
								{/*		<Text>직접설정일 경우 date range picker 영역</Text>*/}
								{/*}*/}
							</View>
						))}
						<TouchableOpacity
							style={styles.searchSubmitButton}
							onPress={onClickSearchTypeSubmit}
						>
							<Text style={styles.searchSubmitText}>확인</Text>
						</TouchableOpacity>
					</View>
				</BottomSheetModal>
			</BottomSheetModalProvider>
		</>
	);
};

const styles = StyleSheet.create({
	controlContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 50,
		backgroundColor: '#000',
		paddingHorizontal: 16,
	},
	noItemText: {
		textAlign: 'center',
		paddingTop: 20,
		fontSize: 14,
		color: '#666',
	},
	bottomSheetContainer: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 30,
		paddingBottom: 5,
		flexDirection: 'column',
		justifyContent: 'space-around',
		paddingHorizontal: 15,
	},
	searchContainer: {
		width: '100%',
	},
	searchTitle: {
		textAlign: 'center',
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 20,
		color: '#333',
	},
	searchItemContainer: {
		flexDirection: 'row',
	},
	searchItemButton: {
		flex: 1,
		backgroundColor: '#f2f2f2',
		paddingVertical: 20,
		borderColor: '#e2e2e2',
		borderWidth: 0.5,
	},
	activeSearchItemButton: {
		backgroundColor: '#fff',
		borderColor: '#000',
	},
	searchItemText: {
		textAlign: 'center',
		fontSize: 13,
		fontWeight: '400',
		color: 'grey',
	},
	activeSearchItemText: {
		fontWeight: '600',
		color: '#000',
	},
	searchSubmitButton: {
		borderRadius: 10,
		backgroundColor: 'orange',
		width: '100%',
		paddingVertical: 20,
	},
	searchSubmitText: {
		textAlign: 'center',
		fontSize: 18,
		fontWeight: '700',
		color: '#fff',
	},
	rangePickerRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 30,
	},
	rangePicker: {
		backgroundColor: 'tomato',
	}
});

export default OngoingListView;
