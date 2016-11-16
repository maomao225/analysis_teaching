var CoBarChart = require('cobar');
var nvToolTip = require('nvToolTip');
var $ = require('jquery');

var CoBarChartMooc = require('cobarMooc');

module.exports = function(interfaces) {
	return {
		scope: {
			d3Cobar: '=',
			cobarTotal: '='
		},
		link: function($scope, ele, attr) {

			var isMooc = ele.attr("cobar-mooc");
			$scope.$watch('d3Cobar', function(newVal, oldVal) {
				$scope.$evalAsync(function() {
					// 清空原来的图
					ele.empty();

					var totalNum = $scope.cobarTotal;

					//判断是否考试章数据
					//console.log(newVal);

					var cobar_data;
					var isExam = false;
					if (!newVal.process){
						if (!newVal.length) {
							ele.html('<div class="empty">暂无数据</div>');
							return false;
						}

						isExam = true;
						newVal.forEach(function(val){
							//val.children = {};

							val["student_percent_number"] =  parseFloat(val["student_percent"].replace("%",""));
							val["over60_percent_number"] =  parseFloat(val["over60_percent"].replace("%",""));
							val["over80_percent_number"] =  parseFloat(val["over80_percent"].replace("%",""));
							val["eq100_percent_number"] =  parseFloat(val["eq100_percent"].replace("%",""));

							var sum_percent = val["student_percent_number"] + val["over60_percent_number"]+
											val["over80_percent_number"] + val["eq100_percent_number"];
							val.name = val.title;

							val.children = [{
						      type : 'exam',
							  rate : val["over60_percent"],
							  title: val["title"],
								children:[{
									children:[
										{
											type:"exam",
											name:"答题人数占比",
											title:val["title"],
											_value:val["student_percent"],
											value:(val["student_percent_number"]/sum_percent)*100
										},
										{
											type:"exam",
											name:"得分 ≦ 60分  占比",
											title:val["title"],
											_value:val["over60_percent"],
											value:(val["over60_percent_number"]/sum_percent)*100
										},
										{
											type:"exam",
											name:"得分 ≧ 80分  占比",
											title:val["title"],
											_value:val["over80_percent"],
											value:(val["over80_percent_number"]/sum_percent)*100
										},
										{
											type:"exam",
											title:val["title"],
											name:"得分 ＝ 100分  占比",
											_value:val["eq100_percent"],
											value:(val["eq100_percent_number"]/sum_percent)*100
										}
									]
								}]
							}]
						});
						cobar_data = newVal;

					}else{
						if (!angular.isDefined(newVal.process) || !newVal.process.length) {
							ele.html('<div class="empty">暂无数据</div>');
							return false;
						}

						//为了兼容学习进度mooc的6＊6就有版本，保留原来的处理代码
						if(isMooc){
							//console.log(newVal.process);
							newVal.process.forEach(function(val1) {
								val1.children.forEach(function(val2, i) {
									// start 解决了后端一个数据格式不对的bug
									if (val2.children && !Array.isArray(val2.children)) {
										val2.children = val2.children.children;
									}
									// end
									var isAllEmpty = [];
									val2.children.forEach(function(val3) {
										val3.parentName = val2.name;
										val3.count = parseInt(val3.value);
										val3.value = val3.value / totalNum * 100;
										if (!val3.value) {
											isAllEmpty.push(0);
										}
									});
									// 如果全空的话第一个值是 100
									if (isAllEmpty.length === 3) {
										val2.children[0].value = 100;
									}
								});
							});

						}else{
							newVal.process.forEach(function(val1) {

								val1.children.forEach(function(val2, i) {
									// start 解决了后端一个数据格式不对的bug
									if (val2.children && !Array.isArray(val2.children)) {
										val2.children = val2.children.children;
									}
									// end

									val2.children.forEach(function(val3) {
										var isAllEmpty = [];
										val3.children.forEach(function(val4){
											val4.parentName = val3.name;
											val4.count = parseInt(val4.value);
											val4.value = val4.value / totalNum * 100;
											if (!val4.value) {
												isAllEmpty.push(0);
											}
										});

										// 如果全空的话第一个值是 100
										if (isAllEmpty.length === 3) {
											val3.children[0].value = 100;
										}
									});

								});
							});
						}


						cobar_data = newVal.process;
					}




					// 之前张晨写的 我改写成了上面的forEach嵌套
					// for (var id1 in newVal.process) {
					// 	for (var id2 in newVal.process[id1].children) {


					// 		if (newVal.process[id1].children[id2].children && !Array.isArray(newVal.process[id1].children[id2].children)) {
					// 			newVal.process[id1].children[id2].children = newVal.process[id1].children[id2].children.children;
					// 		}


					// 		for (var id3 in newVal.process[id1].children[id2].children) {
					// 			newVal.process[id1].children[id2].children[id3].parentName = newVal.process[id1].children[id2].name;
					// 			newVal.process[id1].children[id2].children[id3].count =	parseInt(newVal.process[id1].children[id2].children[id3].value);
					// 			newVal.process[id1].children[id2].children[id3].value =	newVal.process[id1].children[id2].children[id3].value / totalNum * 100;
					// 		}
					// 	}
					// }

					var verticalColor = d3.scale.ordinal().range(['#E9F2F8', 'rgb(112, 205, 67)', '#F37469']);
					var videoColor = d3.scale.ordinal().range(['#E9F2F8', '#7ECDE6', '#7990D4']);
					var discussColor = d3.scale.ordinal().range(['#E9F2F8', '#009DE6']);
					var examColor = d3.scale.ordinal().range(['#f37469', '#d1f47d', '#70cd43', '#22b183']);
					 var defaultColor = d3.scale.category20();

					var barGroupTitleWidth = 90;
					if (isExam){
						barGroupTitleWidth = 113;
					}

					if (isMooc){//保留mooc旧版本的代码
						var coBar = CoBarChartMooc(ele[0], {
							data: cobar_data,//newVal.process
							margin: {
								top: 15,
								right: 20,
								bottom: 5,
								left: 60
							},
							width: 500,
							height: 70,
							barWidth: 8,
							barPadding: 3,
							fontSize: 24,
							color: function(data, i) {
								switch (data.type) {
									case 'problem':
										return verticalColor(i);
									case 'vertical':
										return verticalColor(i);
									case 'video':
										return videoColor(i);
									case 'discussion':
										return discussColor(i);
									default:
										return defaultColor(i);
								}
							},
							onMouseOver: function(data, i, event) {
								var html = '<p class="pro">' + data.parentName + '</p><p class="pro">' + data.name + '</p><p class="num"></p><p class="num">' + data.value.toFixed(2) + '%</p><p class="num">' + data.count + '</p>';
								nvToolTip(html);
							},
							onMouseOut: function() {
								nvToolTip.removeToolTip();
							}
						});

					}else{
						var coBar = CoBarChart(ele[0], {
							data: cobar_data,//newVal.process
							barGroupTitleWidth:barGroupTitleWidth,

							margin: {
								top: 15,
								right: 20,
								bottom: 5,
								left: 35
							},
							width: 500,
							height: 80,
							barWidth: 8,
							barPadding: 3,
							fontSize: 48,
							color: function(data, i) {
								switch (data.type) {
									case 'problem':
										return verticalColor(i);
									case 'vertical':
										return verticalColor(i);
									case 'video':
										return videoColor(i);
									case 'discussion':
										return discussColor(i);
									case 'exam':
										return examColor(i);
									default:
										return defaultColor(i);
								}
							},
							firstTitle:function(data,i){
								switch (data.type) {
									case 'problem':
										return "习题·>60%";
									case 'vertical':
										return "";
									case 'video':
										return "视频·学习";
									case 'discussion':
										return "讨论·发言";
									case 'exam':
										//超过5个字则取前5个
										return data.title.substr(0,4);
									default:
										return "";
								}
							},
							firstNumTitleX:function(data){
								if (data.type!="exam"){
									return 0;
								}
								var x= 12.5;
								return 20 + x * (data.title.length>4?4:data.title.length);
							},
							firstNumTitle:function(data){
								if (data.type!="exam"){
									return "";
								}
								return "·>60%";
							},
							secondTitle:function(data,i){
								switch (data.type) {
									case 'problem':
										return data.wriht_rate;
									case 'vertical':
										return "";
									case 'video':
										return data.study_rate;
									case 'discussion':
										return data.comment_rate;
									case 'exam':
										return data.rate+"";
									default:
										return "";
								}
							},
							secondColor: function(data, i) {
								switch (data.type) {
									case 'problem':
										return "rgb(112, 205, 67)";
									case 'vertical':
										return "rgb(112, 205, 67)";
									case 'video':
										return "#7ECDE6";
									case 'discussion':
										return "#009DE6";
									case 'exam':
										return "#d1f47d";
									default:
										return defaultColor(1);
								}
							},
							onMouseOver: function(data, i, event) {
								var html = "";
								if (data.type == "exam"){
									html = '<p class="pro">' + data.title + '</p><p class="pro">' + data.name + '</p><p class="num"></p><p class="num">' + data._value + '</p>';

								}else{
									html = '<p class="pro">' + data.parentName + '</p><p class="pro">' + data.name + '</p><p class="num"></p><p class="num">' + data.value.toFixed(2) + '%</p><p class="num">' + data.count + '</p>';
								}
								nvToolTip(html);
							},
							onMouseOut: function() {
								nvToolTip.removeToolTip();
							}
						});
					}


					//mooc版本使用，鼠标放到柱子上有跳动
					if (interfaces.indexRelation) {
						for (var id1 in newVal.process) {
							$.ajax({
								dataType: 'json',
								url: interfaces.indexRelation,
								data: {
									// FIXME: chapter_id must select in page?
									chapter_id: newVal.chapter_id,
									sequential_id: newVal.process[id1].id
								},
								success: function(data) {
									for (var id1 in data.relation) {
										var children1 = data.relation[id1].children;
										for (var id2 in children1) {
											var children2 = children1[id2].children;
											for (var id3 in children2) {
												var children3 = children2[id3].map;
												for (var id4 in children3) {
													var children4 = children3[id4].children;
													for (var id5 in children4) {
														var children5 = children4[id5].children;
														for (var id6 in children5) {
															children5[id6].value = children5[id6].value / totalNum * 100;
														}
													}
												}
											}
										}
									}
									coBar.map(data);
								}
							});
						}
					}

				});
			});
		}
	}
};
