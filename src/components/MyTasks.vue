<template>
	<div>
	<h2>Ваши текущие задачи</h2>
	<div v-if="tasksData.results && tasksData.results.length > 0" class="row">
		<div
		class="col-md-4 mb-3"
		v-for="task in tasksData.results"
		:key="task.id"
		>
		<div
			class="card"
			:class="{ 'completed-task': task.time_completion }"
		>
			<div class="card-body">
			<h5 class="card-title"><strong>Название:</strong> {{ task.title }}</h5>
			<p class="card-text"><strong>Создатель:</strong> {{ task.task_creator }}</p>
			<p class="card-text"><strong>Описание:</strong> {{ task.description }}</p>
			<p class="card-text"><strong>Сложность:</strong> {{ task.difficulty }}</p>
			<p class="card-text"><strong>Примерное время выполнения:</strong> {{ task.task_duration }}</p>
			<p class="card-text"><strong>Дата создания:</strong> {{ formatDate(task.time_create) }}</p>
			<p v-if="task.time_completion" class="card-text"><strong>Время завершения задачи:</strong> {{ formatDate(task.time_completion) }}</p>
			<button v-if="!task.time_completion" @click="closeTask(task.id)" class="btn btn-primary">Закрыть задачу</button>
			</div>
		</div>
		</div>
	</div>
	<div v-else>
		<p>Задачи не найдены.</p>
	</div>
	</div>

	<div v-if="tasksData.previous || tasksData.next" class="pagination">
	<button
		v-if="tasksData.previous"
		@click="fetchTasks(tasksData.previous)"
		class="btn btn-secondary"
	>
		Предыдущая страница
	</button>
	<button
		v-if="tasksData.next"
		@click="fetchTasks(tasksData.next)"
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
		tasksData: {
		results: [],
		next: null,
		previous: null,
		},
	};
	},
	methods: {
	async fetchTasks(url = `${process.env.VUE_APP_API_URL}/tasks/my-tasks/`) {
		try {
		const accessToken = localStorage.getItem('access_token');

		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};

		const response = await axios.get(url, {
			headers: headers,
		});

		this.tasksData = response.data.task;

		} catch (error) {
		console.error('Ошибка при загрузке задач:', error);
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
	closeTask(taskId) {
		this.$router.push({ name: 'create-report', params: { id: taskId } });
	}
	},
	mounted() {
	this.fetchTasks();
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

.completed-task {
	border: 2px solid green;
}
</style>
