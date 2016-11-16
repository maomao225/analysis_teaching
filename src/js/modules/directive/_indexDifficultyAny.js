/**
 * Created by yanguoxu on 15/8/13.
 */

var xuetangX_chart = require("d3XtChart");
var nvToolTip = require('nvToolTip');

module.exports = function(app) {
	app.directive('indexDifficultyany', ['$templateCache', '$rootScope', '$compile', 'interfaces', 'sassConfig',
		'ajax', '$q', 'dotMatrixDataConvert',
		function($templateCache, $rootScope, $compile, interfaces, sassConfig, ajax, $q,dotMatrixDataConvert) {
		   return {
			  link: {
				pre: function($scope,$element,attr) {
					//console.log("_indexDifficultyAny");
					// select框

					if ($scope.fetchChapter.chapters && $scope.fetchChapter.chapters.length) {
						$scope.selectOption = $scope.fetchChapter.chapters;
						//console.log($scope.selectOption);
						$scope.selectModel = $scope.fetchChapter.chapters.slice(-1)[0].id;
						var lastChapter = $scope.fetchChapter.chapters.slice(-1)[0];
						//sValue = $scope.fetchChapter.chapters.slice(-1)[0].id;
						var ilen = $scope.fetchChapter.chapters.length;
						if (lastChapter["is_exam"] == true){//删除掉多余的考试章
							$scope.fetchChapter.chapters = $scope.fetchChapter.chapters.slice(0,ilen-1);
							$scope.selectOption = $scope.fetchChapter.chapters;
							$scope.selectModel = $scope.fetchChapter.chapters.slice(-1)[0].id;
						}
						//console.log($scope.selectModel);
					}
					//if ($scope.selectModel){
					//	updateChapter($scope.selectModel);
					//}

					function formatTime(value){
						value = value.toFixed(0);
						var iMinutes = Math.floor(value/60);
						var seconds = value-iMinutes*60;
						var hour = Math.floor(iMinutes/60);
						iMinutes = iMinutes - hour * 60;
						iMinutes = iMinutes>9?iMinutes:("0"+iMinutes);
						seconds = seconds>9?seconds:("0"+seconds);
						if (hour>0){
							return hour + ":" + iMinutes +":" + seconds;
						}
						return iMinutes +":" + seconds;
					};

					function getFormatTime(value){
						var minutes = Math.floor(value/60);
						var second = (value - minutes *60).toFixed(0);
						if (minutes>10000)
						  return minutes + "'";
						return minutes + "'" + second + '"';
					}

					function _add_seeCount(record,d){
						record.data.push($.extend(
								{
									times : [d["start"],d["end"]],
									secondCount : d["num3"],
									thirdCount : d["num4"],
									forthCount : d["more"],
									type:0
								},
								d
						) );
					};

					var video_map={};

					function _addVideo(d,curSection){
						var record = {
							times:d["length"],
							video_index:d["video_index"],
							vid:d["vid"],
						    data:[]
						};
						video_map[d["vid"]] = record;

						_add_seeCount(record,d);

						curSection["sections"].push(record);
					}

					function showChart(data_video,data_problem,data_difficulty,totalNum,review_num){
						$("#difficultAny_chart",$element).empty();
						var data=[];
						var curSection,seq_index=-1,video_index=-1;
     					for(var i=0;i<data_video.length;i++){
  							var d= data_video[i];
                            if (seq_index!=d["seq_index"]){
								curSection = {};
								curSection["seq_name"] = d["seq_name"];
								curSection["seq_index"] = d["seq_index"];
								curSection["sections"] = [];
								_addVideo(d,curSection);
								video_index = d["video_index"];
								data.push(curSection);
								seq_index = d["seq_index"];
								continue;
							}
							if (video_index != d["video_index"]){
								_addVideo(d,curSection);
								video_index = d["video_index"];
							}
							_add_seeCount(curSection["sections"][curSection["sections"].length-1],d);

						}
						var curIndex=0;
						for(var i=0;i<data_problem.length;i++){
							var d= data_problem[i];
							if (video_map[d["vid"]]){
								video_map[d["vid"]].data.push($.extend(
										{
											times:[d["start"],d["end"]],
											errorCount:d["wrong_num"],
											type:1
										},
										d
								));
							}

						}
						for(var i=0;i<data_difficulty.length;i++){
							var d= data_difficulty[i];
							if (video_map[d["vid"]]){
								video_map[d["vid"]].data.push($.extend({
									times:[d["start"],d["end"]],
									difficultyCount:d["wrong_num"],
									secondCount : d["num3"],
									thirdCount : d["num4"],
									forthCount : d["more"],
									type:2
								},d));
							}
						}
						//console.dir(data);

						var difficultAny = new xuetangX_chart.difficultyAny(data,{
							container:$("#difficultAny_chart",$element)[0],
							width:500,//根据数据长度自动计算
							minWidth:458,
							totalNum:totalNum,
							height:255,
							y_start:25,
							onMouseOver:function(d,i,event){
								if (d.type=="1") {
									var start =  formatTime(d["start"]),
											end = formatTime(d["end"]);

									var html = "<div class='tooltip_difficultyAny'>";
									var innerHtml = "";

									innerHtml = "<p class='chapter_name'>第{seq_index}节 / 视频教学</p>" +
									"<p class='word'>{seq_name}</p>" +
									"<p class='word'>{vname}</p>" +
									"<p class='p_br'></p>"+
									"<p class='ft18 g_num'>"+start+"-"+end+"</p>"+
									"<p>学习总人数："+totalNum+"</p>"+
									"<p class='bottomP'>复习总人数："+review_num+"</p>"+
									"<p>习题答题人数：{user_num}</p>"+
									"<p class='bottomP'><span class='errorSymbol'></span>习题答错人次：{wrong_num}</p>";
									innerHtml = xuetangX_chart.base.format(innerHtml,d);
									html += (innerHtml+"</div>");

									nvToolTip(html,{"showAngle":true,"offsetLeft":125,"event":event});
									return;
								};
								var start =  formatTime(d["start"]),
										end = formatTime(d["end"]);

								var html = "<div class='tooltip_difficultyAny'>";
								var innerHtml = "";

								innerHtml = "<p class='chapter_name'>第{seq_index}节 / 视频教学</p>" +
								"<p class='word'>{seq_name}</p>" +
								"<p class='word'>{vname}</p>" +
								"<p class='p_br'></p>"+
								(d.type==2?"<p class='chapter_name'>难点</p>":"")+
								"<p class='ft18 g_num'>"+start+"-"+end+"</p>"+
								"<p>学习总人数："+totalNum+"</p>"+
								"<p class='bottomP'>复习总人数："+review_num+"</p>"+
								"<p>学习1遍人数：{num1}</p>"+
								"<p>学习2遍人数：{num2}</p>"+
								"<p class='relativeP'><span class='thirdSymbol'></span>学习3遍人数：{secondCount}</p>"+
								"<p class='relativeP'><span class='forthSymbol'></span>学习4遍人数：{thirdCount}</p>"+
								"<p class='bottomP'><span class='fifthSymbol'></span>学习5遍及以上人数：{forthCount}</p>";
								innerHtml = xuetangX_chart.base.format(innerHtml,d);
								html += (innerHtml+"</div>");

								nvToolTip(html,{"showAngle":true,"offsetLeft":125,"event":event});
							},
							onMouseLeave:function(d,i,event){
								nvToolTip.removeToolTip();
							}
						});


					}

					function updateChapter(newVal){
						$scope.loading = true;

						var sendData = {
							chapter_id:newVal
						};
						//console.log("change:"+newVal);

						$q.all([ajax({
								url: interfaces.indexDifficultyDurationStatistics,
								params: sendData
						}), ajax({
								url: interfaces.indexDifficultyVideoStatistics,
								params: sendData
						}), ajax({
								url: interfaces.indexDifficultyProblemStatistics,
								params: sendData
						}),
							ajax({
								url: interfaces.indexDifficultyVideo,
								params: sendData
						}),
							ajax({
								url: interfaces.indexDifficultyProblem,
								params: sendData
						}),
							ajax({
								url: interfaces.indexDifficultyDifficulty,
								params: sendData
						}),
							ajax({
								url: interfaces.indexChapter,
								params: sendData
								})
						]).then(function(allResponse) {
							//console.debug(allResponse[0].data.data);
							$scope.difficulty_total = allResponse[0].data.data;
							$scope.difficulty_total["duration2"] = getFormatTime($scope.difficulty_total["duration"]);
							$scope.difficulty_total["smaller"] = $scope.difficulty_total["percent"].match("-");
							//console.debug(allResponse[1].data.data);
							$scope.video_total = allResponse[1].data.data;
							$scope.video_total["duration2"] = getFormatTime($scope.video_total["duration"]);
							$scope.video_total["duration_per_student2"] = getFormatTime($scope.video_total["duration_per_student"]);
							$scope.video_total["smaller"] = $scope.video_total["percent"].match("-");
							//console.debug(allResponse[2].data.data);
							$scope.problem_total = allResponse[2].data.data;
							//$scope.problem_total["duration2"] = formatTime($scope.problem_total["duration"]);
							$scope.problem_total["smaller"] = $scope.problem_total["percent"].match("-");
							//难点分析数据转换
                            var data_video = allResponse[3].data.data;
							var data_problem = allResponse[4].data.data;
							var data_difficulty= allResponse[5].data.data;
							//console.log(allResponse[6].data);
							var chapter_review = allResponse[6].data["chapter_review"];
							var totalNum = 0,review_num=0;//学习人数
							for(var i=0;i<chapter_review.length;i++){
								if(chapter_review[i]["id"]=="study_num"){
									totalNum = chapter_review[i]["value"];
								}
								if(chapter_review[i]["id"]=="review_num"){
									review_num = chapter_review[i]["value"];
								}
							}
							showChart(data_video,data_problem,data_difficulty,totalNum,review_num);
							$scope.loading = false;

							setTimeout(function(){
								$("#difficultAny_chart",$element).scrollLeft(0);
							},100);


						}, function(XHR) {
							console.error(XHR);
						});
					}

					$scope.$watch('selectModel', function(newVal, oldVal) {
						if (newVal === oldVal) {
							return false;
						}
                        updateChapter(newVal);

					});
					$scope.updateChapter = updateChapter;
		        },
				post: function($scope, $element) {

					//$("select.chapters",$element).dropdown();
					$('.ui.dropdown',$element)
							.dropdown()
					;
					var sValue = $scope.selectModel;
					setTimeout(function () {
						//初始化完毕，默认选项
						//$("select.chapters").val(sValue);
						//$scope.selectModel = $scope.selectModel;
						$(".selection",$element).dropdown(
								{
									onChange: function(value, text, $selectedItem) {
										//console.log("value:"+value);
										$scope.updateChapter(value);
									}
								}
						);
						$(".selection",$element).dropdown("set selected",sValue);

					},1000);

				}
			  }
		   }
	     }]);
};
