<template>
	<div>
	<h2>Назначить задачу №{{ this.$route.params.id }}</h2>
	<h4>Пожалуйста, выберите исполнителя:</h4>
	<div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
		{{ successMessage }}
	</div>
	<div v-if="filteredUsers.length > 0" class="row">
		<div
		class="col-md-4 mb-3"
		v-for="user in filteredUsers"
		:key="user.id"
		:class="{'card-selected': task_performer === user.id}"
		>
		<div
			class="card"
			@click="selectUser(user.id)"
		>
			<div class="card-body">
			<p class="card-text">{{ user.first_name }} {{ user.last_name }}</p>
			</div>
		</div>
		</div>
	</div>
	<div v-else>
		<p>Пользователи не найдены.</p>
	</div>
	<button @click="assignTask()" class="btn btn-primary" :disabled="!task_performer">
		Назначить задачу
	</button>
	<div v-if="usersData.previous || usersData.next" class="pagination mb-5">
		<button
		v-if="usersData.previous"
		@click.prevent="fetchUsers(usersData.previous)"
		class="btn btn-secondary"
		>
		Предыдущая
		</button>
		<button
		v-if="usersData.next"
		@click.prevent="fetchUsers(usersData.next)"
		class="btn btn-secondary"
		>
		Следующая
		</button>
	</div>
	</div>
</template>

<script>
import axios from '../../utils/axiosConfig';

export default {
	data() {
	return {
		task_performer: '',
		usersData: {
		results: [],
		next: null,
		previous: null,
		},
		successMessage: ''
	};
	},
	methods: {
	async fetchUsers(url = `${process.env.VUE_APP_API_URL}/users/list/`) {
		try {
		const accessToken = localStorage.getItem('access_token');
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};
		const response = await axios.get(url, { headers });
		this.usersData = response.data.user;
		} catch (error) {
		console.error('Ошибка при загрузке пользователей:', error);
		}
	},
	selectUser(userId) {
		this.task_performer = userId;
	},
	async assignTask() {
		try {
		const accessToken = localStorage.getItem('access_token');
		const formData = {
			task_performer: this.task_performer
		};
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};
		await axios.patch(`${process.env.VUE_APP_API_URL}/tasks/list/${this.$route.params.id}/assign/`, formData, { headers });
		this.successMessage = 'Задача успешно назначена!';
		this.task_performer = '';
		} catch (error) {
		console.error('Ошибка при назначении задачи:', error);
		}
	}
	},
	mounted() {
	this.fetchUsers();
	},
	computed: {
	filteredUsers() {
		return this.usersData.results.filter(user => !user.is_manager);
	}
	}
};
</script>

<style>
.col-md-4 {
	padding: 10px;
}
.pagination {
	margin-top: 15px;
}
.card-selected {
	border: 2px solid #007bff;
	background-color: #e9f5ff;
}
button:disabled {
	background-color: #d6d6d6;
	border-color: #c4c4c4;
	cursor: not-allowed;
}
</style>
