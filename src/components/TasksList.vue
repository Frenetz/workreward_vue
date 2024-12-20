<template>
	<div>
	<h2>Список задач</h2>
	<router-link v-if="isManager" :to="{ name: 'create-task'}" class="btn btn-primary">
		Создать задачу
	</router-link>
	<div v-if="tasksData.results && tasksData.results.length > 0" class="row">
		<div class="col-md-4 mb-3" v-for="task in tasksData.results" :key="task.id">
		<div class="card" :class="{ 'completed-task': task.time_completion }">
			<div class="card-body">
			<h5 class="card-title"><strong>Название:</strong> {{ task.title }}</h5>
			<p class="card-text"><strong>Создатель:</strong> {{ task.task_creator }}</p>
			<p class="card-text"><strong>Сложность:</strong> {{ task.difficulty }}</p>
			<p class="card-text"><strong>Примерное время выполнения:</strong> {{ task.task_duration }}</p>
			<p class="card-text"><strong>Дата создания:</strong> {{ formatDate(task.time_create) }}</p>
			<p class="card-text" v-if="task.time_completion"><strong>Задачу выполнил:</strong> {{ task.task_performer }}</p>
			<p class="card-text" v-else-if="task.task_performer"><strong>Выполняет задачу:</strong> {{ task.task_performer }}</p>
			<p class="card-text" v-else>Данную задачу никто не выполняет</p>
			<router-link :to="{ name: 'task-detail', params: { id: task.id } }" class="btn btn-primary">
				Подробнее
			</router-link>
			</div>
		</div>
		</div>
	</div>
	<div v-else>
		<p class="mt-3">Задачи не найдены.</p>
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
		isManager: false,
	};
	},
	methods: {
	async fetchTasks(url = `${process.env.VUE_APP_API_URL}/tasks/list/`) {
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
	checkIfManager() {
		const isManager = localStorage.getItem('is_manager');
		this.isManager = isManager === 'true';
	}
	},
	mounted() {
	this.fetchTasks();
	this.checkIfManager();
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

.ml-2 {
	margin-left: 10px;
}

.completed-task {
	border: 2px solid green;
}
</style>
