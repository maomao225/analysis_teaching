module.exports = function(app) {
	app.directive('indexSchedule', ['scheduleAddFunction', '$templateCache', '$rootScope', '$compile', 'interfaces', 'sassConfig', 'scheduleDataConversion', 'ajax', '$q', 'scheduleItemsPerPage', 'scheduleIntiDotMatrix', 'dotMatrixDataConvert', 'schedulePaginationChanged',
		'scheduleDataScore', function(scheduleAddFunction, $templateCache, $rootScope, $compile, interfaces, sassConfig, scheduleDataConversion, ajax, $q, scheduleItemsPerPage, scheduleIntiDotMatrix, dotMatrixDataConvert, schedulePaginationChanged,scheduleDataScore) {
			return {
				link: {
					pre: function($scope) {

						$scope.staticDir = interfaces.staticDir;
						$scope.loading = false;

						//console.dir($scope.indexScheduleExam);
						$scope.exam_show = false;
						if($scope.indexScheduleExam){
							$scope.exam_items = $scope.indexScheduleExam.data.data;
						}
						// 发送数据给home controller
						if ($scope.fetchChapter) {
							$scope.$emit('courseData', $scope.fetchChapter.course);
						}

						// 总选课人数
						var curregisterTotal = $scope.curregisterTotal = $scope.curregisterTotal.regist_count;

						// 三个圈圈图
						scheduleDataConversion($scope, $scope.fetchChapter, curregisterTotal);

						// cobar图
						// $scope.cobar = fetchProcess;

						var itemsPerPage = scheduleItemsPerPage;
						// dotMatrix
						$scope.dotMatrix = dotMatrixDataConvert($scope.dotMatrix);

						// pagination
						$scope.pagination = {};
						$scope.pagination.currentPage = 1;
						$scope.pagination.totalItems = curregisterTotal || 0;
						$scope.pagination.itemsPerPage = itemsPerPage;
						var calcStartNumber = function() {
							return ($scope.pagination.currentPage - 1) * itemsPerPage;
						};
						$scope.pagination.startNumber = calcStartNumber();
						$scope.pagination.pageChanged = scheduleAddFunction($scope.pagination.pageChanged, function() {
							$scope.pagination.startNumber = calcStartNumber();
							// 重绘dot matrix
							schedulePaginationChanged($scope);
						});

						// select框
						if ($scope.fetchChapter.chapters && $scope.fetchChapter.chapters.length) {
							$scope.selectOption = $scope.fetchChapter.chapters;
							$scope.selectModel = $scope.fetchChapter.chapters.slice(-1)[0].id;
						}
						$scope.selectModelChange = function(newVal) {
							//console.log("selectModel:"+newVal);
							//if (newVal === oldVal) {
							//	return false;
							//}

							$scope.loading = true;

							var sendData = {
								chapter_id: newVal
							};

							if (newVal.indexOf("exam-")==0){
								$scope.exam_show = true;

								var chapter_id = $scope.indexScheduleExam.data.chapter_id;
								newVal = newVal.replace("exam-","");
								sendData = {
									chapter_id: chapter_id,
									sequential_id:newVal
								};
								//加载考试章内容
								$q.all([ajax({
									url: interfaces.indexScheduleScore, //得分
									params: sendData
								}), ajax({
									url: interfaces.indexScheduleExamSeqDetail,//Cobar
									params: sendData
								}), ajax({
									url: interfaces.indexScheduleExamStudentScore,//学生详细
									params: sendData
								})]).then(function(allResponse) {
									// 重绘圆圈图
									//console.log(allResponse[0].data);

									scheduleDataScore($scope,allResponse[0].data.data, curregisterTotal);

									//scheduleDataConversion($scope, allResponse[0].data, curregisterTotal);
									//
									// 重绘cobar图
									//console.log(allResponse[1].data.data);
									$scope.cobar = allResponse[1].data.data;

									// 重绘 dotMatrix
									scheduleIntiDotMatrix($scope, allResponse[2].data.data);

									// 分页 重置
									$scope.pagination.currentPage = 1;
									$scope.pagination.startNumber = calcStartNumber();

									$scope.loading = false;

								}, function(XHR) {
									console.error(XHR);
								});

								return;
							}

							$scope.exam_show = false;


							$q.all([ajax({
								url: interfaces.indexChapter,
								params: sendData
							}), ajax({
								url: interfaces.indexProcess,
								params: sendData
							}), ajax({
								url: interfaces.indexDotmatrix,
								params: sendData
							})]).then(function(allResponse) {
								// 重绘圆圈图
								scheduleDataConversion($scope, allResponse[0].data, curregisterTotal);

								// 重绘cobar图
								$scope.cobar = allResponse[1].data;

								// 重绘 dotMatrix
								scheduleIntiDotMatrix($scope, allResponse[2].data);
								// 分页 重置
								$scope.pagination.currentPage = 1;
								$scope.pagination.startNumber = calcStartNumber();

								$scope.loading = false;

							}, function(XHR) {
								console.error(XHR);
							});
						};

						$scope.setColor = function(thisData) {
							var gray = '#E9F2F8';
							var color = '';
							if($scope.exam_show){
								var colors = ['#f37469', '#d1f47d', '#70cd43', '#22b183'];
								var score = parseFloat((thisData.score + "").replace("%",""));
								if (score>=100){
									color = colors[3];
								}else if(score>=80){
									color = colors[2];
								}else if(score>=60){
									color = colors[1];
								}else {
									color = colors[0];
								}
								return color;
							}

							if (thisData.type === 'problem') {
								if (thisData.correctness === 'correct') {
									color = sassConfig.$dark_green;
								} else if (thisData.correctness === 'incorrect') {
									color = '#F37469';
								} else {
									color = gray;
								}
							} else if (thisData.type === 'video') {
								if (!thisData.watch_num) {
									color = gray;
								} else if (thisData.watch_num > 1) {
									color = '#7990D4';
								} else {
									color = '#7ECDE6';
								}
							} else {
								if (thisData.last_modified) {
									color = '#009DE6';
								} else {
									color = gray;
								}
							}
							return color;
						};
					},
					post: function($scope, ele) {
						$('.ui.dropdown',ele).dropdown();
						var sValue = "";
						if ($scope.fetchChapter.chapters && $scope.fetchChapter.chapters.length) {
							var lastChapter = $scope.fetchChapter.chapters.slice(-1)[0];
							sValue = $scope.fetchChapter.chapters.slice(-1)[0].id;
							var ilen = $scope.fetchChapter.chapters.length;
							if (lastChapter["is_exam"] == true){
								var index_i = ilen-2;
								while(index_i>=0){
									if ($scope.fetchChapter.chapters[index_i] && (!$scope.fetchChapter.chapters[index_i]["is_exam"])){
										sValue = $scope.fetchChapter.chapters[index_i].id;
										break;
									}
									index_i--;
								}


							}


						}

						setTimeout(function () {
							//初始化完毕，默认选项
							$(".selection",ele).dropdown(
								{
									onChange: function(value, text, $selectedItem) {
										//console.log("value:"+value);
										if ($scope.selectModel == value){
											return;
										}
										$scope.selectModel = value;
										$scope.selectModelChange(value);
									}
								}
							);
							$(".selection",ele).dropdown("set selected",sValue);

						},1000);

						$scope.$evalAsync(function() {
							// 滚动同步
							var $cobar = ele.find('.cobar');
							var $dotMatrix = ele.find('.dot_matrix');
							var $username = ele.find('.username').find('ul').eq(0);
							var timer = null;
							$cobar.on('scroll', function() {
								clearTimeout(timer);
								var that = this;
								timer = setTimeout(function() {
									var left = that.scrollLeft;
									$cobar[0].scrollLeft = left;
									// scrollbar bugs
									$dotMatrix[0].scrollLeft = $cobar[0].scrollLeft;
								}, 200);
							});
							// 点击分页时 滚动归零
							$scope.pagination.pageChanged = scheduleAddFunction($scope.pagination.pageChanged, function() {
								$dotMatrix[0].scrollLeft = 0;
								$dotMatrix[0].scrollTop = 0;
								$cobar[0].scrollLeft = 0;
							});

							// dotMatrix popup
							var $popup = ele.find('.popup').eq(0);
							if (!$popup.length) {
								$popup = $('<div class="ui popup top center dot_matrix_wrap_popup"></div>').appendTo(ele);
							}

							$scope.mouseenterPath = function(pointX, pointY, eleOffsetX, eleOffsetY, arrOutsideIndex, arrInsideIndex) {
								var newScope = $rootScope.$new();
								var html = '';
								if (!$scope.exam_show){
									$.extend(newScope, $scope.dotMatrix[arrOutsideIndex][arrInsideIndex]);
								}else{
									$.extend(newScope, $scope.dotMatrix[arrOutsideIndex]);
								}

								newScope.staticDir = interfaces.staticDir;

								if (newScope.type === 'problem') {
									newScope["newAnswer"]=[];
									for(var i in newScope["answer"]){
										var obj = {};
										obj[i] = newScope["answer"][i];
										obj["sortkey"] = i;
										newScope["newAnswer"].push(obj);
									}
									newScope["newAnswer"].sort(function(a,b){
										return a["sortkey"]>b["sortkey"]?1:-1;
									});

									html = $compile($templateCache.get('dotMatrix/questionPopup.html'))(newScope);
								} else if (newScope.type === 'video') {
									html = $compile($templateCache.get('dotMatrix/videoPopup.html'))(newScope);
								} else if (newScope.type === 'discussion') {
									html = $compile($templateCache.get('dotMatrix/discussionPopup.html'))(newScope);
								} else if(newScope.sectionType){
									if (newScope.sectionType == "video"){
										newScope.caption = "视频学习比例";

									}else if(newScope.sectionType == "problem"){
										newScope.caption = "答题正确率";
									}else if(newScope.sectionType =="discussion"){
										newScope.caption = "发帖回帖总数";
									}
									html = $compile($templateCache.get('dotMatrix/summerPopup.html'))(newScope);

								} else if($scope.exam_show){
									html = $compile($templateCache.get('dotMatrix/examScore.html'))(newScope);
								}

								newScope.$digest();
								newScope.$destroy();

								if (!html) {
									return false;
								}
								$popup.html(html);

								$popup.css({
									display: 'block',
									left: pointX + eleOffsetX + 3,
									top: pointY + eleOffsetY - 10
								});
							};

							var popupHide = function() {
								$popup.hide();
							};

							$scope.mouseleavePath = popupHide;
							$scope.mouseoutCanvas = popupHide;

							// user mouseover popup
							$scope.userPopupMouseOver = function($event, index) {
								var data = $scope.dotMatrix[index][0];
								if (data.correct_rate !== undefined) {
									var newScope = $rootScope.$new();
									$.extend(newScope, data);
									var html = $compile($templateCache.get('dotMatrix/userPopup.html'))(newScope);

									$popup.html(html);

									$popup.css({
										display: 'block',
										left: $($event.target).offset().left + 1,
										top: $($event.target).offset().top - 10
									});
								}
							};

							$scope.userPopupMouseOut = function($event, index) {
								$popup.hide();
							};
						});
					}
				}
			}
		}]);

	app.directive('indexScheduleMooc', ['dateFormat', 'scheduleDataConversion', '$q', 'ajax', 'interfaces', function(dateFormat, scheduleDataConversion, $q, ajax, interfaces) {
		return {
			restrict: 'EA',
			link: {
				pre: function($scope, ele, attr) {
					$scope.loading = false;

					if ($scope.chapter.chapters && $scope.chapter.chapters.length) {

						// select
						$scope.selectOption = $scope.chapter.chapters;
						$scope.selectModel = $scope.chapter.chapters.slice(-1)[0].id;

						// title 里的内容
						$scope.timeLag = dateFormat($scope.chapter.chapters[0].start).fromNow();
						$scope.titleChapterName = $scope.chapter.chapters.slice(-1)[0].name;
					}

					if ($scope.chapter['chapter_active'] && $scope.chapter['chapter_active'].length) {
						scheduleDataConversion($scope, $scope.chapter, $scope.curregisterTotal.regist_count);
					}

					$scope.selectModelChange= function(newVal){
						//if (newVal === oldVal) {
						//	return false;
						//}

						$scope.loading = true;

						var sendData = {
							chapter_id: newVal
						};

						$q.all([ajax({
							url: interfaces.indexChapter,
							params: sendData
						}), ajax({
							url: interfaces.indexProcessMooc,
							params: sendData
						})]).then(function(allResponse) {

							$scope.chapter = allResponse[0].data;

							// 重绘圆圈图
							scheduleDataConversion($scope, $scope.chapter, $scope.curregisterTotal.regist_count);

							// 重绘cobar图
							$scope.cobar = allResponse[1].data;

							// title 里的内容
							for (var i = 0, l = $scope.chapter.chapters.length; i < l; i++) {
								if ($scope.chapter.chapters[i].id == newVal) {
									$scope.timeLag = dateFormat($scope.chapter.chapters[i].start).fromNow();
									$scope.titleChapterName = $scope.chapter.chapters[i].name;
								}
							}

							$scope.loading = false;

						}, function(XHR) {
							console.error(XHR);
						});
					};
				},
				post: function($scope, ele) {
					$('.ui.dropdown',ele).dropdown();
					var sValue = "";
					if ($scope.chapter.chapters && $scope.chapter.chapters.length) {
						sValue = $scope.chapter.chapters.slice(-1)[0].id;
					}

					setTimeout(function () {
						//初始化完毕，默认选项
						$(".selection",ele).dropdown(
							{
								onChange: function(value, text, $selectedItem) {
									//console.log("value:"+value);
									if ($scope.selectModel == value){
										return;
									}
									$scope.selectModel = value;
									$scope.selectModelChange(value);
								}
							}
						);
						$(".selection",ele).dropdown("set selected",sValue);

					},1000);
				}
			}

		}
	}]);

}
