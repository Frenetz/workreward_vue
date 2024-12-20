<template>
	<div>
	<h2>Информация о задаче</h2>
	<div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
		{{ successMessage }}
	</div>	
	<div v-if="task">
		<div class="card">
		<div class="card-body">
			<h5 class="card-title"><strong>Название:</strong> {{ task.title }}</h5>
			<p class="card-text"><strong>Описание:</strong> {{ task.description }}</p>
			<p class="card-text"><strong>Сложность:</strong> {{ task.difficulty }}</p>
			<p class="card-text"><strong>Примерное время выполнения:</strong> {{ task.task_duration }}</p>
			<p class="card-text"><strong>Дата создания:</strong> {{ formatDate(task.time_create) }}</p>
			<p class="card-text"><strong>Дата начала:</strong> {{ formatDate(task.time_start) }}</p>
			<p v-if="task.time_completion" class="card-text">
			<strong>Дата завершения:</strong> {{ formatDate(task.time_completion) }}
			</p>
			<p class="card-text"><strong>Создатель:</strong> {{ task.task_creator }}</p>
			<p v-if="task.task_performer" class="card-text"><strong>Исполнитель:</strong> {{ task.task_performer }}</p>
			<p v-if="!task.task_performer" class="card-text">Данную задачу никто не выполняет</p>
		</div>
	</div>
	<button v-if="!isManager" @click="takeTask()" class="btn btn-primary">Взять задачу</button>
	<router-link v-if="isManager && !task.task_performer" :to="{ name: 'assign-task', params: { id: task.id } }" class="btn btn-primary ml-5">
		Назначить задачу
	</router-link>	
	</div>
	<div v-else>
		<p>Загрузка данных о задаче...</p>
	</div>
	</div>
</template>

<script>
import axios from '../../utils/axiosConfig';

export default {
	data() {
	return {
		task: null,
		successMessage: '',
		isManager: false
	};
	},
	methods: {
	async fetchTask(id) {
		try {
		const accessToken = localStorage.getItem('access_token');

		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};

		const response = await axios.get(`${process.env.VUE_APP_API_URL}/tasks/list/${id}/`, {
			headers: headers,
		});

		this.task = response.data.task;
		} catch (error) {
		console.error('Ошибка при загрузке задачи:', error);
		}
	},
	formatDate(dateString) {
		if (!dateString) return 'Не указано';
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
	async takeTask() {
		try {
			const id = this.$route.params.id;
			const accessToken = localStorage.getItem('access_token');

			const headers = {
				Authorization: `Bearer ${accessToken}`,
			};

			await axios.patch(`${process.env.VUE_APP_API_URL}/tasks/list/${id}/take/`, {}, {
				headers: headers,
			});

			this.successMessage = 'Вы успешно взяли задачу в работу!';
			this.$router.push({ name: 'my-tasks' });
		} catch (error) {
			console.error('Ошибка при загрузке задачи:', error);
		}
	},
	checkIfManager() {
			const isManager = localStorage.getItem('is_manager');
			this.isManager = isManager === 'true';
	}		
	},
	mounted() {
		const taskId = this.$route.params.id;
		this.fetchTask(taskId);
		this.checkIfManager();
	},
};
</script>

<style scoped>
.card {
	margin: 20px;
}

.card-title {
	font-size: 1.5rem;
}

.card-text {
	font-size: 1.125rem;
}
</style>
