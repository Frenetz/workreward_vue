<template>
	<div>
		<h2>Ваши премии</h2>
		<div v-if="rewardsData.results && rewardsData.results.length > 0" class="row">
		<div class="col-md-4 mb-3" v-for="reward in rewardsData.results" :key="reward.id">
			<div class="card">
			<div class="card-body">
				<h5 class="card-title"><strong>Сумма:</strong> {{ reward.reward_sum }}</h5>
				<p class="card-text"><strong>Комментарий:</strong> {{ reward.comment }}</p>
				<p class="card-text"><strong>ID-отчета:</strong> {{ reward.task_report }}</p>
			</div>
		</div>
		</div>
		</div>
		<div v-else>
		<p>Премии не найдены.</p>
		</div>
	</div>

		<div v-if="rewardsData.previous || rewardsData.next" class="pagination">
			<button
				v-if="rewardsData.previous"
				@click="fetchReports(rewardsData.previous)"
				class="btn btn-secondary"
			>
				Предыдущая страница
			</button>
			<button
				v-if="rewardsData.next"
				@click="fetchReports(rewardsData.next)"
				class="btn btn-secondary"
			>
				Следующая страница
			</button>
		</div>
</template>
	


<script>
import axios from '../../utils/axiosConfig';

export default {
	data() {
		return {
			rewardsData: {
				results: [],
				next: null,
				previous: null,		
			},
		};
	},
	methods: {
		async fetchRewards(url = `${process.env.VUE_APP_API_URL}/rewards/my-rewards/`) {
			try {
				const accessToken = localStorage.getItem('access_token');

				const headers = {
					Authorization: `Bearer ${accessToken}`,
				};

				const response = await axios.get(url, {
					headers: headers,
				});

				this.rewardsData = response.data.reward;

			} catch (error) {
				console.error('Ошибка при загрузке отчетов:', error);
			}
		},
		formatDate(dateString) {
			const date = new Date(dateString);
			return date.toLocaleString('ru-RU', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			});
		},
	},
	mounted() {
		this.fetchRewards();
	},
};
</script>



<style scoped>
	.card {
	cursor: pointer;
	}

	.card-title {
	font-size: 1.25rem;
	}

	.card-text {
	font-size: 1rem;
	}

	.row {
	display: flex;
	flex-wrap: wrap;
	}

	.col-md-4 {
	padding: 10px;
	}
</style>
