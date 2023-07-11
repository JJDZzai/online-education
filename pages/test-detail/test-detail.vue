<template>
	<view>
		<!-- 考试时间 -->
		<test-timer @end="end" :expire="expire" v-if="expire > 0"></test-timer>

		<!-- 考试题型，主体部分 -->
		<view class="mt-2">
			<uni-card style="padding: 0;" :title="topic.type | formatType" :extra="'第' + current + '题'" isFull
				:border="false" :is-shadow="true">
				<mp-html class="mb-2" :content="topic.title">
					<view class="flex justify-center align-center text-light-muted">加载中...</view>
				</mp-html>

				<!-- 问答题 -->
				<textarea class="w-100 border p-2 font" style="box-sizing: border-box;" v-model="topic.user_value[0]"
					v-if="topic.type == 'answer'" placeholder="请输入答案..." />

				<!-- 填空题 -->
				<view v-else-if="topic.type == 'completion'">
					<textarea class="w-100 border p-2 font mb-2" style="box-sizing: border-box;"
						v-model="topic.user_value[index]" placeholder="请输入答案..."
						v-for="(item,index) in topic.user_value" :key="index" />
					<main-btn @submit="addCompletion">添加填空</main-btn>
				</view>

				<!-- 选择题 + 判断题-->
				<view v-else-if="topic.type == 'trueOrfalse' || topic.type == 'radio'">
					<test-option v-for="(item, index) in topic.options" :key="index" :content="item" :index="index"
						:checked="topic.user_value == index" @select="handleOption"></test-option>
				</view>

				<!-- 多选题 -->
				<view v-else-if="topic.type == 'checkbox'">
					<test-option v-for="(item, index) in topic.options" :key="index" :content="item" :index="index"
						:checked="index | formatChecked(topic.user_value)" @select="handleOption"></test-option>
				</view>
			</uni-card>
		</view>

		<!-- 底部 bar -->
		<test-actions :current="current" :total="total" @on-page="onPage" @submit="onSubmit"></test-actions>
	</view>
</template>

<script>
	export default {
		filters: {
			formatType(value) {
				const questionOptions = {
					radio: '单选题',
					answer: '问答题',
					completion: '填空题',
					trueOrfalse: '判断题',
					checkbox: '多选题'
				}
				return questionOptions[value]
			},
			formatChecked(value, ary) {
				return ary.includes(value)
			}
		},
		data() {
			return {
				current: 0,
				total: 0,
				list: [],
				id: 0,
				expire: 0,
				title: '',
				user_test_id: 0,
				// 左上角返回按钮返回
				isBack: false
			}
		},
		onLoad(e) {
			if (!e.id) {
				this.$toast('非法参数')
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					});
				}, 700)
				return
			}
			this.id = e.id

			this.getData()
		},
		onBackPress() {
			// 真正返回
			if (this.isBack) {
				// 通知考试列表刷新数据
				uni.$emit('refreshTestList')
				return false
			}
			// 拦截返回
			uni.showModal({
				content: '确定要放弃此场考试吗？',
				cancelText: '继续考试',
				confirmText: '放弃考试',
				success: (res) => {
					if (res.cancel) {
						return
					}
					this.isBack = true
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 700)
				}
			});
			return true
		},
		computed: {
			topic() {
				return this.list[this.current] || {}
			},
			// 判断没有填的题目
			notFilled() {
				let arr = []
				this.list.forEach((item, index) => {
					if (((item.type == 'answer' || item.type == 'completion') && !item.user_value[0]) || ((item
							.type == 'trueOrfalse' || item.type == 'radio') && !item.user_value == -1) || (
							item.type == 'checkbox' && !item.user_value.length)) {
						arr.push(index + 1)
					}
				})
				return arr
			}
		},
		methods: {
			getData() {
				this.$load('加载中')
				this.$api.readTestpaper({
					id: this.id
				}).then(res => {
					this.list = res.testpaper_questions
					this.expire = res.expire
					this.title = res.title
					this.user_test_id = res.user_test_id
					this.total = this.list.length
					if (this.total > 0) {
						this.current = 1
					}
				}).finally(() => {
					this.$hide()
				})
			},
			// test-timer 组件事件
			end() {
				this.$toast('考试结束')
				this.isBack = true
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				})
			},
			// test-actions 组件事件
			onPage(value) {
				this.current = value
			},
			onSubmit() {
				if (this.notFilled.length > 0) {
					return uni.showModal({
						content: `还有题目没有完成：第${this.notFilled.join(',')}题`,
						showCancel: false
					});
				}
				uni.showModal({
					content: '确定要交卷吗？',
					cancelText: '继续做题',
					confirmText: '立即交卷',
					success: (res) => {
						if (res.cancel) {
							return
						} else {
							this.submit()
						}
					}
				});
			},
			// 确认交卷
			submit() {
				this.$load('提交中...')
				this.$api.submitTest({
					user_test_id: this.user_test_id,
					value: this.list.map(item => item.user_value)
				}).then(res => {
					this.$toast('提交成功')
					this.isBack = true
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 500)
				}).finally(() => {
					this.$hide()
				})
			},
			// 添加填空
			addCompletion() {
				this.list[this.current - 1].user_value.push('')
			},
			// test-options 组件，选中题目
			handleOption(value) {
				if (this.topic.type == 'radio' || this.topic.type == 'trueOrfalse') {
					this.list[this.current - 1].user_value = value
					return
				} else {
					let index = this.topic.user_value.findIndex(item => item == value)
					if (index == -1) {
						this.topic.user_value.push(value)
					} else {
						this.topic.user_value.splice(index, 1)
					}
				}
			},
			handleBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>
	.no-list {
		position: fixed;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50px);
	}
</style>