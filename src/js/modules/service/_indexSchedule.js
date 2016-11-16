module.exports = function(app) {
	app.provider('scheduleItemsPerPage', function() {
		return {
			$get: function() {
				return 20;
			}
		};
	})

	app.provider('scheduleIntiDotMatrix', function() {
		return {
			$get: ['dotMatrixDataConvert', function(dotMatrixDataConvert) {
				return function($scope, data) {
					// 重绘 dotMatrix
					if ($scope.exam_show){
						$scope.dotMatrix = data;
					}else{
						$scope.dotMatrix = dotMatrixDataConvert(data);
					}

				}
			}]
		};
	});

	app.provider('scheduleAddFunction', function() {
		return {
			$get: function() {
				return function(obj, fn) {
					var type = Object.prototype.toString.call(obj).toLowerCase();
					if (type.indexOf('function') > 0) {
						return function() {
							obj();
							fn();
						}
					} else {
						return fn;
					}
				}
			}
		};
	});

	app.provider('schedulePaginationChanged', function() {
		return {
			$get: ['ajax', 'interfaces', 'scheduleItemsPerPage', 'scheduleIntiDotMatrix', function(ajax, interfaces, scheduleItemsPerPage, scheduleIntiDotMatrix) {
				return function($scope) {
					$scope.pagination.loading = true;
					if ($scope.exam_show){
						var chapter_id = $scope.indexScheduleExam.data.chapter_id;
						var newVal = $scope.selectModel.replace("exam-","");

						ajax({
							url: interfaces.indexScheduleExamStudentScore,
							params: {
								currentPage: $scope.pagination.currentPage - 1,
								itemsPerPage: scheduleItemsPerPage,
								chapter_id:chapter_id,
								sequential_id:newVal
							}
						}).then(function(response) {
							scheduleIntiDotMatrix($scope, response.data.data);
							$scope.pagination.loading = false;
						}, function(XHR) {
							$scope.pagination.loading = false;
							console.error(XHR);
						});

						return;
					}


					ajax({
						url: interfaces.indexDotmatrix,
						params: {
							currentPage: $scope.pagination.currentPage - 1,
							itemsPerPage: scheduleItemsPerPage,
							chapter_id: $scope.selectModel
						}
					}).then(function(response) {
						scheduleIntiDotMatrix($scope, response.data);
						$scope.pagination.loading = false;
					}, function(XHR) {
						$scope.pagination.loading = false;
						console.error(XHR);
					});
				}
			}]
		};
	});

	//转化数据为一个二维数组
	app.provider('dotMatrixDataConvert', function() {
		return {
			$get: ['scheduleSelectChoiceMap', function(scheduleSelectChoiceMap) {

				return function(data) {
					if (!data || !data.data || !data.data.data || !data.data.data.length) {
						return [];
					}

					var outSideArr = [];
					data.data.data.forEach(function(val) {
						var inSideArr = [];//每一行，每个人信息

						val.data.forEach(function(val1) {//每小节
							var skey_Ary=["video","problem","discussion"];//按照顺序读取
							for(var type_index =0;type_index<skey_Ary.length;type_index++){
								var skey = skey_Ary[type_index];
								if (!val1.data[skey]) continue;
								var json = {};
								json.sectionType = skey;
								json.seq = val1.seq_index;
								json.avatar = val.avatar;
								json.username = val.username;
								json.name = val1.name;

								var record = val1.data[skey];
								json.value =  record["seq_level_study_rate"] || record["seq_level_wight_rate"] ||
								record["seq_level_comment_num"];
								inSideArr.push(json);
								record.detail.forEach(function(val2) {
									var json = $.extend({}, val2);
									json.username = val.username;
									json.seq = val1.seq_index;
									json.name = val1.name;
									json.username = val.username;
									json.avatar = val.avatar;
									if (val.predict) {
										json.correct_rate = val.predict.correct_rate;
										json.predict_time = val.predict.predict_time;
										json.success_probability = val.predict.success_probability;
									}
									inSideArr.push(json);

									if (json.tag && json.tag.indexOf('choice') !== -1 && json.value) {
										if (!Array.isArray(json.value)) {
											json.value = [json.value];
										}
										json.value.forEach(function(val3, i) {
											if (val3.indexOf('choice') !== -1) {
												json.value[i] = scheduleSelectChoiceMap[val3];
											}
										});
									}
									json = null;
								});

							}



						});
						outSideArr.push(inSideArr);
					});
					//console.dir(outSideArr);
					return outSideArr;
				}
			}]
		};
	});

	app.provider('scheduleSelectChoiceMap', function() {
		return {
			$get: function() {
				return {
					choice_0: 'A',
					choice_1: 'B',
					choice_2: 'C',
					choice_3: 'D',
					choice_4: 'E',
					choice_5: 'F',
					choice_6: 'G',
					choice_7: 'H',
					choice_8: 'I',
					choice_9: 'G',
					choice_10: 'K'
				}
			}
		};
	});

	//考试章显示
	//app.provider('scheduleExamShow',function(){
	//	return {
	//		$get:['scheduleDataScore',function(scheduleDataScore){
	//			return function($scope,chapterID,examID){
	//
	//				//var scoredata,data;
	//				//scheduleDataScore($scope,scoredata,data);
	//			}
	//		}]
	//	}
	//});

	//得分的圆圈数据转换
	app.provider('scheduleDataScore',function(){
		return {
			$get:function(){
				return function($scope, scoreData, data){
					var totalNum = data;

					if (scoreData) {
						for (var key in scoreData) {
							//scoreData[key]._value = scoreData[key];
							scoreData[key+"_percent"] = (scoreData[key] / totalNum * 100).toFixed(2);
						}

						var newscoredata=[];
						newscoredata.push({
							"name": "答题人数占比",
							"value": scoreData.student_num_percent,
							"id": "student_percent"
						});
						newscoredata.push({
							"name": "得分 ≧ 60分  占比",
							"value": scoreData.over60_num_percent,
							"id": "over60_percent"
						});
						newscoredata.push({
							"name": "得分 ≧ 80分  占比",
							"value": scoreData.over80_num_percent,
							"id": "over80_percent"
						});
						newscoredata.push({
							"name": "得分 ＝ 100分  占比",
							"value": scoreData.eq100_num_percent,
							"id": "eq100_percent"
						});
						//console.log(newscoredata);
						$scope.score = {
							data: newscoredata,
							margin: {
								top: 14,
								right: 3,
								bottom: 14,
								left: 3
							},
							width: 250,
							height: 95,
							arcWidth: 2,
							arcPadding: 0,
							fontSize: 12,
							backgroundArcColor: '#f4f8fb',
							backgroundArcWidth: 2,
							color: d3.scale.ordinal().range(['#f37469', '#d1f47d', '#70cd43', '#22b183']),
							label: {
								title: '得分',
								subtitle: [],
								detail: []
							},
							legendNumFontSize:13,
							showNum:true,
							showNum_X:function(data,i){
								var x=[95,100,100,109];
								return x[i];
							},
							legendNumFormat:function(data,i){
								return data.value + '%';
							},
							showLegend: true,
							legendFormat:function(data){
								return data.name + ' ' ;
							}
						};
					} else {
						$scope.score = {
							data: []
						}
					}
				}
			}

		}

	});


	app.provider('scheduleDataConversion', function() {
		return {
			$get: function() {
				return function($scope, fetchChapter, data) {
					var _formatNum = function(num) {
						return num.toLocaleString();
					}
					var legendFormat = function(data) {
						return data.name + '占比 ' + data.value + '%';
					}

					var totalNum = data;

					var studyNum = 0,
						studyNumPercent = 0,
						studyNumIncrease = 0;

					if (fetchChapter['chapter_active'] && fetchChapter['chapter_active'].length) {

						if (fetchChapter['chapter_active']) {
							for (var key in fetchChapter['chapter_active']) {
								if (fetchChapter['chapter_active'][key].id == 'count') {
									studyNum = fetchChapter['chapter_active'][key].value;
									studyNumPercent = (studyNum / totalNum * 100).toFixed(2);
								} else if (fetchChapter['chapter_active'][key].id == 'day_increase') {
									studyNumIncrease = fetchChapter['chapter_active'][key].value;
								}
							}
						}
						$scope.study = {
							data: [{
								'id': 'studyNum',
								value: studyNumPercent
							}],
							margin: {
								top: 32,
								right: 22,
								bottom: 32,
								left: 22
							},
							width: 250,
							height: 270,
							arcWidth: 6,
							fontSize: 60,
							subtitleFontSize: 12,
							detailFontSize: 12,
							backgroundArcColor: '#e9f2f8',
							backgroundArcWidth: 6,
							color: function() {
								return '#009ee3';
							},
							label: {
								title: studyNumPercent + '%',
								subtitle: ['学习人数占比'],
								detail: [
									'学习人数 ' + _formatNum(studyNum),
									'昨日 +' + _formatNum(studyNumIncrease)
								]
							}
						};
					} else {
						$scope.study = {
							data: []
						}
					}

					if (fetchChapter['chapter_review'] && fetchChapter['chapter_review'].length) {
						for (var key in fetchChapter['chapter_review']) {
							fetchChapter['chapter_review'][key].value = (fetchChapter['chapter_review'][key].value / totalNum * 100).toFixed(2);
						}
						$scope.video = {
							data: fetchChapter['chapter_review'],
							margin: {
								top: 14,
								right: 3,
								bottom: 14,
								left: 3
							},
							width: 250,
							height: 92,
							arcWidth: 2,
							arcPadding: 0,
							fontSize: 12,
							backgroundArcColor: '#f4f8fb',
							backgroundArcWidth: 2,
							color: d3.scale.ordinal().range(['#7fcde6', '#7990d4']),
							label: {
								title: '视频',
								subtitle: [],
								detail: []
							},
							showLegend: true,
							legendFormat: legendFormat
						};
					} else {
						$scope.video = {
							data: []
						}
					}

					if (fetchChapter['chapter_answer'] && fetchChapter['chapter_answer'].length) {
						for (var key in fetchChapter['chapter_answer'][0].children) {
							fetchChapter['chapter_answer'][0].children[key]._value = fetchChapter['chapter_answer'][0].children[key].value;
							fetchChapter['chapter_answer'][0].children[key].value = (fetchChapter['chapter_answer'][0].children[key].value / totalNum * 100).toFixed(2);
						}
						$scope.problem = {
							data: fetchChapter['chapter_answer'][0].children,
							margin: {
								top: 14,
								right: 3,
								bottom: 14,
								left: 3
							},
							width: 250,
							height: 95,
							arcWidth: 2,
							arcPadding: 0,
							fontSize: 12,
							backgroundArcColor: '#f4f8fb',
							backgroundArcWidth: 2,
							color: d3.scale.ordinal().range(['#f37469', '#d1f47d', '#70cd43', '#22b183']),
							label: {
								title: '习题',
								subtitle: [],
								detail: []
							},
							showLegend: true,
							legendFormat:legendFormat
							//legendFormat: function(data) {
							//return data.name + ' ' + data._value + '人';
							//}
						};
					} else {
						$scope.problem = {
							data: []
						}
					}

					if (fetchChapter['chapter_discussion'] && fetchChapter['chapter_discussion'].length) {
						for (var key in fetchChapter['chapter_discussion']) {
							fetchChapter['chapter_discussion'][key].value = (fetchChapter['chapter_discussion'][key].value / totalNum * 100).toFixed(2);
						}
						$scope.discussion = {
							data: fetchChapter['chapter_discussion'],
							margin: {
								top: 14,
								right: 3,
								bottom: 14,
								left: 3
							},
							width: 250,
							height: 92,
							arcWidth: 2,
							arcPadding: 0,
							fontSize: 12,
							backgroundArcColor: '#f4f8fb',
							backgroundArcWidth: 2,
							color: d3.scale.ordinal().range(['#189de6']),
							label: {
								title: '讨论',
								subtitle: [],
								detail: []
							},
							showLegend: true,
							legendFormat: legendFormat
						};
					} else {
						$scope.discussion = {
							data: []
						}
					}
				}
			}
		}
	});
};
