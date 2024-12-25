<template>
	<div>
		<h2 v-if="isManager">Отчеты</h2>
		<h2 v-if="!isManager">Ваши отчеты</h2>
		<div v-if="reportsData.results && reportsData.results.length > 0" class="row">
		<div class="col-md-4 mb-3" v-for="report in reportsData.results" :key="report.id">
			<div class="card">
			<div class="card-body">
				<h5 class="card-title"><strong>ID-отчета:</strong> {{ report.id }}</h5>
				<p class="card-text"><strong>ID-задачи:</strong> {{ report.task.id }}</p>
				<p class="card-text"><strong>Название задачи:</strong> {{ report.task.title }}</p>
				<p class="card-text"><strong>Текст отчета:</strong> {{ report.text }}</p>
				<p class="card-text"><strong>Коэффициент эффективности:</strong> {{ report.efficiency_score }}</p>
				<div class="mt-3">
					<router-link v-if="isManager && report.is_awarded == false" :to="{ name: 'create-reward', params: { id: report.id } }" class="btn btn-primary ml-3">
						Назначить премию
					</router-link>
					<button v-if="isManager" @click="downloadReport(report.id)" class="btn btn-primary mt-3">
						Скачать подробный отчет
					</button>
				</div>		
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
			status: false,
			isManager: false
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
				console.log(response);
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
		setStatus() {
			if (localStorage.getItem('is_manager') === 'true') {
				this.isManager = true;
			}
			else {
				this.isManager = false;
			}
		},
		async downloadReport(reportId) {
			try {
				const accessToken = localStorage.getItem('access_token');

				const headers = {
					Authorization: `Bearer ${accessToken}`,
				};

				const response = await axios.get(`${process.env.VUE_APP_API_URL}/reports/${reportId}/download/`, {
					headers: headers,
					responseType: 'blob',
				});

				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', `report_${reportId}.pdf`);
				document.body.appendChild(link);
				link.click();

				document.body.removeChild(link);
				window.URL.revokeObjectURL(url);				

			} catch (error) {
				console.error('Ошибка при загрузке отчетов:', error);
			}
		}
	},
	mounted() {
		this.fetchReports();
		this.setStatus();
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

	.btn {
	margin-right: 10px;
	}
</style>
