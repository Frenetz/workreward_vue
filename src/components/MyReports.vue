<template>
	<div>
		<h2>Ваши отчеты</h2>
		<div v-if="reportsData.results && reportsData.results.length > 0" class="row">
		<div class="col-md-4 mb-3" v-for="report in reportsData.results" :key="report.id">
			<div class="card">
			<div class="card-body">
				<h5 class="card-title"><strong>Название:</strong> {{ report.title }}</h5>
				<p class="card-text"><strong>Создатель:</strong> {{ report.task_creator }}</p>
				<p class="card-text"><strong>Описание:</strong> {{ report.description }}</p>
				<p class="card-text"><strong>Сложность:</strong> {{ report.difficulty }}</p>
				<p class="card-text"><strong>Примерное время выполнения:</strong> {{ report.task_duration }}</p>
				<p class="card-text"><strong>Дата создания:</strong> {{ formatDate(report.time_create) }}</p>
			</div>
		</div>
		</div>
		</div>
		<div v-else>
		<p>Отчеты не найдены.</p>
		</div>
	</div>

		<div v-if="reportsData.previous || reportsData.next" class="pagination">
			<button
				v-if="reportsData.previous"
				@click="fetchReports(reportsData.previous)"
				class="btn btn-secondary"
			>
				Предыдущая страница
			</button>
			<button
				v-if="reportsData.next"
				@click="fetchReports(reportsData.next)"
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
			reportsData: {
				results: [],
				next: null,
				previous: null,		
			},
		};
	},
	methods: {
		async fetchReports(url = `${process.env.VUE_APP_API_URL}/reports/list/`) {
			try {
				const accessToken = localStorage.getItem('access_token');

				const headers = {
					Authorization: `Bearer ${accessToken}`,
				};

				const response = await axios.get(url, {
					headers: headers,
				});

				this.reportsData = response.data.task_report;

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
		this.fetchReports();
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
